import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import {
  ArrowLeft, Users, MapPin, Calendar, Crown, Send, Shield,
  MessageCircle, Wallet, ChevronRight, Globe, UserPlus, Zap,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { addGroupPoolContribution, getGroupById, getGroupChatMessages, joinGroupTrip, saveGroupChatMessages } from '../data/groupTripsData';
import { getItineraryById } from '../data/discoveryItineraries';
import { useTrips } from '../../../context/TripContext';
import { createTripPayloadFromGroup, getLinkedTripIdForGroup, saveLinkedTripForGroup } from '../services/groupTripJoinService.jsx';
import { useAuth } from '../../../context/AuthContext';
import { groupTripService } from '../api/groupTripService.jsx';

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
  };
};

const GroupTripDetail = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const chatEndRef = useRef(null);
  const { user, token } = useAuth();
  const [refreshKey, setRefreshKey] = useState(0);
  const [remoteGroup, setRemoteGroup] = useState(null);
  const currentUserEmail = (user?.email || 'demo@user.local').toLowerCase();

  const group = useMemo(() => {
    const localGroup = getGroupById(groupId);
    if (localGroup) {
      const isAdmin = (localGroup.members || []).some(
        (member) => member.role === 'organizer' && String(member.email || '').toLowerCase() === currentUserEmail,
      );
      return {
        ...localGroup,
        source: localGroup.source || 'local',
        isAdmin,
      };
    }
    return remoteGroup;
  }, [groupId, refreshKey, remoteGroup, currentUserEmail]);
  const itinerary = useMemo(() => (group ? getItineraryById(group.itineraryId) : null), [group]);
  const { createTrip, getTripById } = useTrips();

  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [joinError, setJoinError] = useState('');
  const [poolInput, setPoolInput] = useState('0');
  const [isAddingPool, setIsAddingPool] = useState(false);
  const currentUser = 'You';
  const currentUserName = user?.name || 'You';

  const linkedTripId = useMemo(() => {
    if (!group) return '';
    return getLinkedTripIdForGroup(group.id);
  }, [group]);

  const linkedTrip = linkedTripId ? getTripById(linkedTripId) : null;

  useEffect(() => {
    let active = true;

    const loadRemoteGroup = async () => {
      if (!token) {
        setRemoteGroup(null);
        return;
      }

      try {
        const groups = await groupTripService.fetchMine(token);
        if (!active) return;
        const matched = groups.find((entry) => String(entry._id) === String(groupId));
        if (matched) {
          setRemoteGroup(normalizeBackendGroup(matched, currentUserEmail));
          return;
        }
        setRemoteGroup(null);
      } catch {
        if (active) {
          setRemoteGroup(null);
        }
      }
    };

    loadRemoteGroup();
    return () => {
      active = false;
    };
  }, [groupId, refreshKey, token, currentUserEmail]);

  useEffect(() => {
    if (group) {
      setMessages(getGroupChatMessages(group.id));
    }
  }, [group]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.gd-block', {
        y: 16, opacity: 1, stagger: 0.08, duration: 0.55, ease: 'power3.out',
      });
    }, containerRef);
    return () => ctx.revert();
  }, [groupId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const text = newMessage.trim();
    if (!text) return;

    const msg = {
      id: Date.now(),
      user: currentUser,
      avatar: 'YO',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toISOString().split('T')[0],
    };
    const updated = [...messages, msg];
    setMessages(updated);
    saveGroupChatMessages(group.id, updated);
    setNewMessage('');
  };

  const budgetPercent = useMemo(() => {
    if (!group) return 0;
    return Math.min(100, Math.round((group.budget.spent / group.budget.total) * 100));
  }, [group]);

  const handleJoinGroup = async () => {
    if (!group) {
      return;
    }

    if (group.isAdmin) {
      setJoinError('You are the admin of this group and cannot join again.');
      return;
    }

    setJoinError('');

    if (linkedTrip?.id) {
      navigate(`/trip/${linkedTrip.id}`);
      return;
    }

    setIsJoining(true);
    try {
      if (group.source === 'backend') {
        if (!token) {
          setJoinError('Please login to join this group.');
          return;
        }

        await groupTripService.join(token, group.id, Number(poolInput) || 0);
        setRefreshKey((value) => value + 1);
        setJoinError('Joined successfully.');
        return;
      }

      if (!itinerary) {
        setJoinError('This group does not have a linked public itinerary to open yet, but you can still join from Group Trips list.');
        return;
      }

      const joinedGroup = joinGroupTrip(group.id, {
        name: currentUserName,
        email: currentUserEmail,
        poolContribution: Number(poolInput) || 0,
      });

      const createdTrip = await createTrip(createTripPayloadFromGroup(joinedGroup, itinerary));
      if (!createdTrip?.id) {
        setJoinError('Unable to join this group right now. Please try again.');
        return;
      }
      saveLinkedTripForGroup(group.id, createdTrip.id);
      setRefreshKey((value) => value + 1);
      navigate(`/trip/${createdTrip.id}`);
    } finally {
      setIsJoining(false);
    }
  };

  const handleAddPool = async () => {
    if (!group) {
      return;
    }
    setIsAddingPool(true);
    try {
      if (group.source === 'backend') {
        if (!token) {
          return;
        }
        await groupTripService.addPool(token, group.id, Number(poolInput) || 0);
      } else {
      addGroupPoolContribution(group.id, {
        email: currentUserEmail,
        amount: Number(poolInput) || 0,
      });
      }
      setRefreshKey((value) => value + 1);
    } finally {
      setIsAddingPool(false);
    }
  };

  if (!group) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center">
        <h2 className="text-3xl font-black text-slate-900">Group not found</h2>
        <p className="text-slate-500 mt-2">This group may have been removed.</p>
        <button onClick={() => navigate('/groups')} className="mt-6 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold">
          Back to Groups
        </button>
      </div>
    );
  }

  const onlineCount = group.members.filter((m) => m.online).length;
  const spotsLeft = group.maxMembers - group.members.length;
  const organizer = group.members.find((m) => m.role === 'organizer');
  const tabs = [
    { id: 'chat', label: 'Group Chat', icon: <MessageCircle size={16} /> },
    { id: 'guidelines', label: 'Guidelines', icon: <Shield size={16} /> },
    { id: 'itinerary', label: 'Trip Plan', icon: <Globe size={16} /> },
    { id: 'budget', label: 'Budget', icon: <Wallet size={16} /> },
  ];

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto">
      <button onClick={() => navigate('/groups')} className="gd-block flex items-center gap-2 text-slate-500 hover:text-blue-600 font-semibold mb-6 transition-colors">
        <ArrowLeft size={18} /> Back to Groups
      </button>

      <header className="gd-block mb-8">
        <div className="relative rounded-4xl overflow-hidden h-48">
          <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <h1 className="text-3xl font-black">{group.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm opacity-90 flex-wrap">
              <span className="flex items-center gap-1"><MapPin size={14} /> {group.destination}</span>
              <span className="flex items-center gap-1"><Calendar size={14} /> {group.startDate} — {group.endDate}</span>
              <span className="flex items-center gap-1"><Users size={14} /> {group.members.length}/{group.maxMembers}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="gd-block flex gap-2 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'chat' && (
              <motion.div
                key="chat"
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1, y: -10 }}
                className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                  <MessageCircle size={18} className="text-blue-600" />
                  <h3 className="font-bold text-slate-900">Group Chat</h3>
                  <span className="ml-auto text-xs font-bold text-green-600">{onlineCount} online</span>
                </div>

                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => {
                    const isMe = msg.user === currentUser;
                    return (
                      <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isMe ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {msg.avatar}
                        </div>
                        <div className={`max-w-[75%] ${isMe ? 'text-right' : ''}`}>
                          <div className="flex items-center gap-2 mb-0.5">
                            {!isMe && <span className="text-xs font-bold text-slate-700">{msg.user}</span>}
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                          </div>
                          <div className={`px-4 py-2 rounded-2xl text-sm ${
                            isMe
                              ? 'bg-blue-600 text-white rounded-br-md'
                              : 'bg-slate-100 text-slate-700 rounded-bl-md'
                          }`}>
                            {msg.text}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="px-5 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-40"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'guidelines' && (
              <motion.div
                key="guidelines"
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1, y: -10 }}
                className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Shield size={18} className="text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900">Group Guidelines</h3>
                </div>
                <div className="space-y-3">
                  {group.guidelines.map((rule, i) => (
                    <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
                {organizer && (
                  <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                    <Crown size={16} className="text-amber-600" />
                    <p className="text-sm text-amber-800 font-semibold">
                      Organized by <strong>{organizer.name}</strong> — contact the organizer for any guideline updates.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'itinerary' && (
              <motion.div
                key="itinerary"
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1 ,y: -10 }}
                className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Globe size={18} className="text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900">Trip Plan</h3>
                </div>
                {itinerary ? (
                  <div className="space-y-6">
                    <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                      <h4 className="font-bold text-blue-800 mb-1">{itinerary.name}</h4>
                      <p className="text-sm text-blue-600">{itinerary.summary}</p>
                    </div>
                    {itinerary.days.map((day) => (
                      <div key={day.day}>
                        <h4 className="text-sm font-black text-slate-900 mb-3">
                          Day {day.day}: {day.title}
                        </h4>
                        <div className="space-y-2">
                          {day.places.map((place) => (
                            <div key={place.id} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                                <MapPin size={16} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-slate-800 text-sm">{place.name}</p>
                                <p className="text-xs text-slate-400 truncate">{place.time} • {place.duration}</p>
                              </div>
                              <ChevronRight size={16} className="text-slate-300" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => navigate(`/discovery/${group.itineraryId}`)}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                    >
                      View Full Itinerary Details
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-500">No linked itinerary found for this group.</p>
                )}
              </motion.div>
            )}

            {activeTab === 'budget' && (
              <motion.div
                key="budget"
                initial={{ opacity: 1, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 1 ,y: -10 }}
                className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <Wallet size={18} className="text-blue-600" />
                  <h3 className="text-xl font-black text-slate-900">Group Budget</h3>
                </div>

                <div className="p-6 bg-slate-900 rounded-2xl text-white mb-6">
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Pool</p>
                      <p className="text-3xl font-black">{group.budget.currency}{group.budget.total.toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-bold text-blue-400">{budgetPercent}% used</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${budgetPercent}%` }} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Spent</p>
                      <p className="font-bold">{group.budget.currency}{group.budget.spent.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                      <p className="text-[9px] uppercase font-bold text-slate-400">Remaining</p>
                      <p className="font-bold">{group.budget.currency}{(group.budget.total - group.budget.spent).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="p-3 bg-blue-500/15 rounded-xl border border-blue-300/25">
                      <p className="text-[9px] uppercase font-bold text-blue-200">Pool Raised</p>
                      <p className="font-bold">{group.budget.currency}{Number(group.budget.poolRaised || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-amber-500/15 rounded-xl border border-amber-300/25">
                      <p className="text-[9px] uppercase font-bold text-amber-100">Your Pool</p>
                      <p className="font-bold">{group.budget.currency}{Number(group.userPool?.[currentUserEmail] || 0).toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-slate-600">
                  <p className="font-bold mb-2">Per Person Contribution</p>
                  <p className="text-2xl font-black text-slate-900">
                    {group.budget.currency}{Math.ceil(group.budget.total / group.members.length).toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Split equally among {group.members.length} members</p>
                </div>

                <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.18em] mb-2">Add Your Pool</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={0}
                      value={poolInput}
                      onChange={(event) => setPoolInput(event.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 bg-white text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleAddPool}
                      disabled={isAddingPool}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
                    >
                      {isAddingPool ? 'Adding...' : 'Add Pool'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <aside className="space-y-6">
          <div className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm p-6">
            <button
              type="button"
              onClick={handleJoinGroup}
              disabled={isJoining || group.isAdmin || (!linkedTrip && spotsLeft <= 0)}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {linkedTrip ? 'Open In My Trips' : group.isAdmin ? 'You are Admin' : isJoining ? 'Joining Group...' : 'Join Group'}
            </button>
            {linkedTrip ? (
              <p className="text-xs text-green-600 font-semibold mt-2">Already linked to your trip workspace.</p>
            ) : null}
            {joinError ? <p className="text-xs text-red-500 font-semibold mt-2">{joinError}</p> : null}
          </div>

          <div className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Users size={16} className="text-blue-600" />
                Members ({group.members.length}/{group.maxMembers})
              </h3>
              {spotsLeft > 0 && (
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  {spotsLeft} open
                </span>
              )}
            </div>
            <div className="space-y-3">
              {group.members.map((m) => (
                <div key={m.id} className="flex items-center gap-3 p-2">
                  <div className="relative">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${
                      m.role === 'organizer' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {m.avatar}
                    </div>
                    <div className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white ${
                      m.online ? 'bg-green-500' : 'bg-slate-300'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 truncate">{m.name}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      {m.role === 'organizer' && <><Crown size={10} className="text-amber-500" /> Organizer</>}
                      {m.role === 'member' && (m.online ? 'Online' : 'Offline')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {spotsLeft > 0 && (
              <button className="mt-4 w-full py-2.5 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                <UserPlus size={14} />
                Invite Member
              </button>
            )}
          </div>

          <div className="gd-block bg-white rounded-4xl border border-slate-100 shadow-sm p-6">
            <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Zap size={16} className="text-amber-500" />
              Quick Info
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-slate-800 capitalize">{group.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration</span>
                <span className="font-bold text-slate-800">
                  {Math.ceil((new Date(group.endDate) - new Date(group.startDate)) / (1000 * 60 * 60 * 24)) + 1} days
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Per Person</span>
                <span className="font-bold text-slate-800">
                  {group.budget.currency}{Math.ceil(group.budget.total / group.members.length).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Organizer</span>
                <span className="font-bold text-slate-800">{organizer?.name || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="gd-block flex flex-wrap gap-2">
            {group.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold">
                {tag}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GroupTripDetail;
