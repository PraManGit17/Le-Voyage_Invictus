import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Compass, FolderKanban, Sparkles, Users } from 'lucide-react';
import { useTrips } from '../../../context/TripContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const { trips } = useTrips();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Compass size={20} />, label: 'Discovery', path: '/discovery' },
    { icon: <Users size={20} />, label: 'Group Trips', path: '/groups' },
  ];

  return (
    <div className="h-screen w-64 bg-[#020617] text-white p-6 flex flex-col border-r border-slate-800">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">W</div>
        <span className="text-xl font-black tracking-tighter">WAYFARER</span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-xl transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <motion.div whileHover={{ x: 5 }} className="flex items-center gap-4 px-4 py-3 cursor-pointer">
              {item.icon}
              <span className="font-semibold text-sm">{item.label}</span>
            </motion.div>
          </NavLink>
        ))}

        {trips.length > 0 && (
          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-4 mb-2">My Trips</p>
            <div className="space-y-1">
              {trips.slice(0, 5).map((trip) => (
                <NavLink
                  key={trip.id}
                  to={`/trip/${trip.id}`}
                  className={({ isActive }) =>
                    `block rounded-xl transition-colors ${
                      isActive ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 px-4 py-2.5 cursor-pointer">
                    <FolderKanban size={16} />
                    <span className="font-semibold text-xs truncate">{trip.title}</span>
                  </motion.div>
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="p-4 bg-linear-to-br from-blue-600/20 to-indigo-600/20 border border-blue-500/30 rounded-2xl">
          <div className="flex items-center gap-2 mb-2 text-blue-400">
            <Sparkles size={16} />
            <span className="text-xs font-bold uppercase tracking-wider">AI Ready</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
            Your agent is ready to optimize your India trip.
          </p>
          <button
            onClick={() => navigate('/discovery')}
            className="w-full py-2 bg-blue-600 rounded-lg text-xs font-bold hover:bg-blue-500 transition-colors"
          >
            Explore Itineraries
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;