import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  FolderKanban, 
  Sparkles, 
  Users, 
  Heart, 
  BookOpen, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  MapPin,
  Calendar,
  Plus 
} from 'lucide-react';
import { useTrips } from '../../../context/TripContext';
import { useAuth } from '../../../context/AuthContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const { user, logout } = useAuth();
  const [expandedSections, setExpandedSections] = useState({
    myTrips: true,
    recentTrips: true
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Compass size={20} />, label: 'Discovery', path: '/discovery' },
    { icon: <Users size={20} />, label: 'Group Trips', path: '/groups' },
    { icon: <Heart size={20} />, label: 'Saved Places', path: '/saved-places' },
    { icon: <BookOpen size={20} />, label: 'Memory Book', path: '/memory-book' },
    { icon: <Users size={20} />, label: 'Travel Workspace', path: '/workspace' },
  ];

  // Group trips by status
  const activeTrips = trips.filter(trip => trip.status !== 'completed');
  const completedTrips = trips.filter(trip => trip.status === 'completed');
  const recentTrips = trips.slice(0, 8); // Show 8 most recent

  return (
    <div 
      className="h-screen w-64 bg-white/95 backdrop-blur-sm text-slate-800 flex flex-col border-r border-amber-200 shadow-lg" 
      style={{ backgroundColor: '#efe3d2' }}
    >
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b border-amber-200">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg">
            <BookOpen size={20} />
          </div>
          <span className="text-xl font-display font-black tracking-tight text-slate-800">LE VOYAGE</span>
        </div>
        <p className="text-xs text-slate-600 font-body">Your AI Travel Companion</p>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-amber-300 scrollbar-track-transparent">
        <div className="p-4 space-y-6">
          
          {/* Main Navigation */}
          <nav className="space-y-1">
            {menuItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.path}
                className={({ isActive }) =>
                  `block rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg transform scale-105' : 'text-slate-600 hover:bg-amber-100 hover:text-amber-700'
                  }`
                }
              >
                <motion.div 
                  whileHover={{ x: 5 }} 
                  className="flex items-center gap-4 px-4 py-3"
                >
                  {item.icon}
                  <span className="font-display font-semibold text-sm">{item.label}</span>
                </motion.div>
              </NavLink>
            ))}
          </nav>

          {/* Quick Actions */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase tracking-wider text-amber-600 font-display font-bold px-2">Quick Actions</h4>
            <button 
              onClick={() => navigate('/discovery')}
              className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-xl border border-blue-200 transition-all duration-300 hover:shadow-md group"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Plus size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium text-blue-700 group-hover:text-blue-800">New Trip</span>
            </button>
          </div>

          {/* My Trips Section */}
          {trips.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('myTrips')}
                className="w-full flex items-center justify-between px-2 py-1 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <h4 className="text-xs uppercase tracking-wider text-amber-600 font-display font-bold">My Trips ({activeTrips.length})</h4>
                {expandedSections.myTrips ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              <AnimatePresence>
                {expandedSections.myTrips && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-1 overflow-hidden"
                  >
                    {activeTrips.slice(0, 6).map((trip) => (
                      <NavLink
                        key={trip.id}
                        to={`/trip/${trip.id}`}
                        className={({ isActive }) =>
                          `block rounded-xl transition-all duration-300 ${
                            isActive ? 'bg-amber-50 text-amber-700 border border-amber-300 shadow-sm' : 'text-slate-500 hover:bg-amber-50 hover:text-amber-600'
                          }`
                        }
                      >
                        <motion.div 
                          whileHover={{ x: 5 }} 
                          className="flex items-start gap-3 px-3 py-2.5"
                        >
                          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FolderKanban size={14} className="text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-semibold text-xs text-slate-800 truncate">{trip.title}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                              <Calendar size={10} />
                              <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      </NavLink>
                    ))}
                    
                    {activeTrips.length > 6 && (
                      <button
                        onClick={() => navigate('/dashboard')}
                        className="w-full text-xs text-amber-600 hover:text-amber-700 py-2 px-3 text-left font-medium transition-colors"
                      >
                        View all {activeTrips.length} trips →
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Recent/Completed Trips */}
          {completedTrips.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => toggleSection('recentTrips')}
                className="w-full flex items-center justify-between px-2 py-1 hover:bg-amber-50 rounded-lg transition-colors"
              >
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-display font-bold">Completed ({completedTrips.length})</h4>
                {expandedSections.recentTrips ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
              
              <AnimatePresence>
                {expandedSections.recentTrips && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="space-y-1 overflow-hidden"
                  >
                    {completedTrips.slice(0, 4).map((trip) => (
                      <NavLink
                        key={trip.id}
                        to={`/trip/${trip.id}`}
                        className="block text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all duration-300"
                      >
                        <motion.div 
                          whileHover={{ x: 5 }} 
                          className="flex items-start gap-3 px-3 py-2"
                        >
                          <div className="w-6 h-6 bg-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FolderKanban size={12} className="text-slate-500" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-display font-medium text-xs truncate">{trip.title}</p>
                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                              <Calendar size={9} />
                              <span>{new Date(trip.startDate).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      </NavLink>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Travel Stats */}
          {trips.length > 0 && (
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
              <h4 className="text-xs uppercase tracking-wider text-purple-600 font-display font-bold mb-3">Travel Stats</h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-lg font-display font-black text-purple-700">{trips.length}</div>
                  <div className="text-xs text-purple-600">Total Trips</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-display font-black text-purple-700">{completedTrips.length}</div>
                  <div className="text-xs text-purple-600">Completed</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - User Info & Actions */}
      <div className="flex-shrink-0 p-4 border-t border-amber-200 space-y-3">
        {/* AI Assistant CTA */}
        <div className="p-4 bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-300 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-amber-600">
            <Sparkles size={16} />
            <span className="text-xs font-display font-bold uppercase tracking-wider">AI Ready</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed mb-3 font-body">
            Your AI assistant is ready to create amazing travel experiences.
          </p>
          <button
            onClick={() => navigate('/discovery')}
            className="w-full py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl text-xs font-display font-bold text-white hover:from-amber-700 hover:to-amber-800 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Start Planning
          </button>
        </div>

        {/* User Profile */}
        {user && (
          <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-amber-200 shadow-sm">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-600 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-white">{user.name?.charAt(0)}</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-display font-bold text-slate-800 truncate">{user.name}</p>
                <p className="text-xs text-slate-600 truncate font-body">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
              title="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;