import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { Users, MapPin, Calendar, ArrowRight, Crown, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createGroupTrip, getAllGroups, joinGroupTrip } from '../data/groupTripsData';
import { useTrips } from '../../../context/TripContext';
import { discoveryItineraries, getItineraryById } from '../data/discoveryItineraries';
import { createTripPayloadFromGroup, getLinkedTripIdForGroup, saveLinkedTripForGroup } from '../services/groupTripJoinService.jsx';
import { useAuth } from '../../../context/AuthContext';
import { tripService } from '../api/tripService';
import { groupTripService } from '../api/groupTripService.jsx';

const statusColors = {
  active: 'bg-green-100 text-green-700',
  upcoming: 'bg-blue-100 text-blue-700',
  completed: 'bg-slate-100 text-slate-500',
};

const getInitials = (name = '') =>
  String(name)
    .split(' ')
    .map((segment) => segment[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'US';

const normalizeBackendGroup = (group, currentUserEmail) => {
  const members = (group.members || []).map((member, index) => ({
    id: member.user || member.email || `${group._id}-member-${index + 1}`,
    name: member.name,
    email: member.email,
    avatar: getInitials(member.name),
    role: member.role === 'organizer' ? 'organizer' : 'member',
    online: false,
  }));

  const isAdmin = members.some(
    (member) => member.role === 'organizer' && String(member.email || '').toLowerCase() === currentUserEmail,
  );
  const isMember = members.some((member) => String(member.email || '').toLowerCase() === currentUserEmail);

  return {
    id: group._id,
    source: 'backend',
    name: group.name,
    itineraryId: group.itineraryId || '',
    destination: group.destination || 'Group Destination',
    image: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80',
    startDate: group.startDate,
    endDate: group.endDate,
    members,
    maxMembers: Number(group.maxMembers) || 6,
    budget: {
      total: Number(group.budget?.total || 0),
      spent: Number(group.budget?.spent || 0),
      currency: group.budget?.currency || '₹',
      poolRaised: Number(group.budget?.poolRaised || 0),
    },
    userPool: {},
    guidelines: Array.isArray(group.guidelines) ? group.guidelines : [],
    status: group.status || 'upcoming',
    tags: Array.isArray(group.tags) ? group.tags : [],
    generatedPlan: group.generatedPlan || {},
    tripData: group.tripData || {},
    isAdmin,
    isMember,
  };
};

const GroupTrips = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { createTrip, getTripById } = useTrips();
  const { user, token } = useAuth();

  const [groups, setGroups] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createForm, setCreateForm] = useState({
    name: '',
    destination: '',
    itineraryId: discoveryItineraries[0]?.id || '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    maxMembers: 6,
    budgetTotal: 30000,
    organizerPool: 0,
    tags: '',
    guidelines: '',
  });

  const refreshGroups = async () => {
    const currentUserEmail = String(user?.email || 'demo@user.local').toLowerCase();

    const localGroups = getAllGroups().map((group) => {
      const members = group.members || [];
      const isAdmin = members.some(
        (member) => member.role === 'organizer' && String(member.email || '').toLowerCase() === currentUserEmail,
      );
      const isMember = members.some((member) => String(member.email || '').toLowerCase() === currentUserEmail);
      return {
        ...group,
        source: group.source || 'local',
        isAdmin,
        isMember,
      };
    });

    if (!token) {
      setGroups(localGroups);
      return;
    }

    try {
      const backendGroups = await groupTripService.fetchMine(token);
      const normalizedBackendGroups = backendGroups.map((group) => normalizeBackendGroup(group, currentUserEmail));
      setGroups([...normalizedBackendGroups, ...localGroups]);
    } catch {
      setGroups(localGroups);
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.grp-card', {
        y: 24,
        opacity: 1,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    refreshGroups();
  }, [token, user?.email]);

  const groupStats = useMemo(() => {
    return {
      totalGroups: groups.length,
      totalTravelers: groups.reduce((sum, item) => sum + item.members.length, 0),
      totalOpenSpots: groups.reduce((sum, item) => sum + Math.max(0, item.maxMembers - item.members.length), 0),
    };
  }, [groups]);

  const handleJoinFromList = async (group, event) => {
    event.stopPropagation();

    if (group.isAdmin) {
      navigate(`/group/${group.id}`);
      return;
    }

    const linkedTripId = getLinkedTripIdForGroup(group.id);
    const linkedTrip = linkedTripId ? getTripById(linkedTripId) : null;

    if (linkedTrip?.id) {
      navigate(`/trip/${linkedTrip.id}`);
      return;
    }

    if (group.source === 'backend') {
      if (!token) {
        navigate(`/group/${group.id}`);
        return;
      }

      try {
        await groupTripService.join(token, group.id, 0);
        await refreshGroups();
      } finally {
        navigate(`/group/${group.id}`);
      }
      return;
    }

    const itinerary = getItineraryById(group.itineraryId);
    if (!itinerary) {
      navigate(`/group/${group.id}`);
      return;
    }

    const joinedGroup = joinGroupTrip(group.id, {
      name: user?.name || 'You',
      email: user?.email || 'demo@user.local',
      poolContribution: 0,
    });

    const createdTrip = await createTrip(createTripPayloadFromGroup(joinedGroup, itinerary));
    if (createdTrip?.id) {
      saveLinkedTripForGroup(group.id, createdTrip.id);
      refreshGroups();
      navigate(`/trip/${createdTrip.id}`);
    }
  };

  const askAIForGroupPlan = async () => {
    if (!createForm.destination.trim()) {
      return;
    }

    setIsAskingAI(true);
    try {
      const reply = await tripService.askAgent(
        `Help create a group itinerary for destination ${createForm.destination} from ${createForm.startDate} to ${createForm.endDate}. Suggest short guidelines and tags.`,
      );

      const aiLine = reply.message.replace(/^Agent suggestion:\s*/i, '').trim();
      setCreateForm((prev) => ({
        ...prev,
        guidelines: prev.guidelines ? `${prev.guidelines}\n${aiLine}` : aiLine,
        tags: prev.tags || 'AI Assisted, Collaborative',
      }));
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleCreateGroupWorkspace = async (event) => {
    event.preventDefault();
    setCreateError('');

    if (!createForm.name.trim() || !createForm.destination.trim() || !createForm.itineraryId) {
      setCreateError('Group name, destination, and itinerary are required.');
      return;
    }

    const selectedItinerary = getItineraryById(createForm.itineraryId);
    if (!selectedItinerary) {
      setCreateError('Selected itinerary is invalid.');
      return;
    }

    setIsCreatingGroup(true);
    try {
      const tags = createForm.tags.split(',').map((item) => item.trim()).filter(Boolean);
      const guidelines = createForm.guidelines.split('\n').map((item) => item.trim()).filter(Boolean);

      const newGroup = createGroupTrip({
        name: createForm.name.trim(),
        destination: createForm.destination.trim(),
        itineraryId: createForm.itineraryId,
        startDate: createForm.startDate,
        endDate: createForm.endDate,
        maxMembers: Number(createForm.maxMembers) || 6,
        budgetTotal: Number(createForm.budgetTotal) || 0,
        tags,
        guidelines,
        organizerName: user?.name || 'You',
        organizerEmail: user?.email || 'demo@user.local',
        organizerPool: Number(createForm.organizerPool) || 0,
      });

      const createdTrip = await createTrip(createTripPayloadFromGroup(newGroup, selectedItinerary));
      if (createdTrip?.id) {
        saveLinkedTripForGroup(newGroup.id, createdTrip.id);
      }

      refreshGroups();
      setIsCreateModalOpen(false);

      if (createdTrip?.id) {
        navigate(`/trip/${createdTrip.id}`);
        return;
      }

      navigate(`/group/${newGroup.id}`);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto">
      <header className="grp-card mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-2">
              <Users size={16} />
              Group Adventures
            </div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Group Trips</h1>
            <p className="text-slate-500 font-medium mt-2">Join a group, plan together, and travel with fellow explorers.</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 hover:bg-blue-600 transition-colors"
          >
            <Zap size={18} />
            Create Group Workspace
          </button>
        </div>
      </header>

      <div className="grp-card grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
          <p className="text-3xl font-black text-blue-700">{groupStats.totalGroups}</p>
          <p className="text-sm font-semibold text-blue-600 mt-1">Active Groups</p>
        </div>
        <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
          <p className="text-3xl font-black text-green-700">
            {groupStats.totalTravelers}
          </p>
          <p className="text-sm font-semibold text-green-600 mt-1">Total Travelers</p>
        </div>
        <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
          <p className="text-3xl font-black text-amber-700">
            {groupStats.totalOpenSpots}
          </p>
          <p className="text-sm font-semibold text-amber-600 mt-1">Open Spots</p>
        </div>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const onlineCount = group.members.filter((m) => m.online).length;
          const spotsLeft = group.maxMembers - group.members.length;
          const linkedTripId = getLinkedTripIdForGroup(group.id);
          const linkedTrip = linkedTripId ? getTripById(linkedTripId) : null;

          return (
            <motion.div
              key={group.id}
              whileHover={{ y: -3 }}
              onClick={() => navigate(`/group/${group.id}`)}
              className="grp-card bg-white rounded-4xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-shadow"
            >
              <div className="flex flex-col lg:flex-row">
                <div className="lg:w-64 h-48 lg:h-auto">
                  <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 p-6 lg:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-black text-slate-900">{group.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[group.status]}`}>
                          {group.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><MapPin size={14} /> {group.destination}</span>
                        <span className="flex items-center gap-1"><Calendar size={14} /> {group.startDate}</span>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-slate-300 mt-1" />
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {group.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{tag}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex -space-x-2">
                        {group.members.slice(0, 5).map((m) => (
                          <div
                            key={m.id}
                            className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white ${
                              m.role === 'organizer' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                            }`}
                            title={`${m.name}${m.role === 'organizer' ? ' (Organizer)' : ''}`}
                          >
                            {m.avatar}
                          </div>
                        ))}
                        {group.members.length > 5 && (
                          <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold border-2 border-white text-slate-500">
                            +{group.members.length - 5}
                          </div>
                        )}
                      </div>

                      <div className="text-sm">
                        <p className="font-bold text-slate-800">
                          {group.members.length}/{group.maxMembers} members
                        </p>
                        <p className="text-xs text-slate-400">
                          {onlineCount} online • {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-400">Budget</p>
                      <p className="text-lg font-black text-slate-900">
                        {group.budget.currency}{group.budget.total.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={(event) => handleJoinFromList(group, event)}
                      disabled={group.isAdmin || (!linkedTrip && spotsLeft <= 0)}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {linkedTrip ? 'Open In My Trips' : group.isAdmin ? 'You are Admin' : 'Join Group'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/60" onClick={() => setIsCreateModalOpen(false)} />
          <form
            onSubmit={handleCreateGroupWorkspace}
            className="relative w-full max-w-2xl rounded-4xl border border-slate-200 bg-white p-6 md:p-8 shadow-2xl space-y-4"
          >
            <h2 className="text-2xl font-black text-slate-900">Create Dynamic Group Workspace</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Group name"
                value={createForm.name}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, name: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <input
                type="text"
                placeholder="Destination"
                value={createForm.destination}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, destination: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="date"
                value={createForm.startDate}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, startDate: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <input
                type="date"
                value={createForm.endDate}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, endDate: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              />
              <input
                type="number"
                min={2}
                max={30}
                value={createForm.maxMembers}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, maxMembers: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                placeholder="Max members"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                min={0}
                value={createForm.budgetTotal}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, budgetTotal: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                placeholder="Total pool budget"
              />
              <input
                type="number"
                min={0}
                value={createForm.organizerPool}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, organizerPool: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
                placeholder="Your pool contribution"
              />
              <select
                value={createForm.itineraryId}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, itineraryId: event.target.value }))}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
              >
                {discoveryItineraries.map((itinerary) => (
                  <option key={itinerary.id} value={itinerary.id}>{itinerary.name}</option>
                ))}
              </select>
            </div>

            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={createForm.tags}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50"
            />

            <textarea
              rows={4}
              placeholder="Group guidelines (one per line)"
              value={createForm.guidelines}
              onChange={(event) => setCreateForm((prev) => ({ ...prev, guidelines: event.target.value }))}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 resize-none"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={askAIForGroupPlan}
                disabled={isAskingAI}
                className="px-4 py-2 rounded-xl bg-amber-100 text-amber-800 text-sm font-bold hover:bg-amber-200 disabled:opacity-60"
              >
                {isAskingAI ? 'AI helping...' : 'AI Help For Group Plan'}
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingGroup}
                  className="px-5 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 disabled:opacity-60"
                >
                  {isCreatingGroup ? 'Creating...' : 'Create Group Workspace'}
                </button>
              </div>
            </div>

            {createError ? <p className="text-sm text-red-500 font-semibold">{createError}</p> : null}
          </form>
        </div>
      )}
    </div>
  );
};

export default GroupTrips;
