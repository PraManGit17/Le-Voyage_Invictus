// import React, { useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
// import { gsap } from 'gsap';
// import { Users, MapPin, Calendar, ArrowRight, Crown, Zap } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
// import { groupTripsData } from '../data/groupTripsData';

// const statusColors = {
//   active: 'bg-green-100 text-green-700',
//   upcoming: 'bg-blue-100 text-blue-700',
//   completed: 'bg-slate-100 text-slate-500',
// };

// const GroupTrips = () => {
//   const navigate = useNavigate();
//   const containerRef = useRef(null);

//   useEffect(() => {
//     if (!containerRef.current) return;
//     const ctx = gsap.context(() => {
//       gsap.from('.grp-card', {
//         y: 24,
//         opacity: 0,
//         stagger: 0.1,
//         duration: 0.6,
//         ease: 'power3.out',
//       });
//     }, containerRef);
//     return () => ctx.revert();
//   }, []);

//   return (
//     <div ref={containerRef} className="max-w-7xl mx-auto">
//       <header className="grp-card mb-10">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
//           <div>
//             <div className="flex items-center gap-2 text-blue-600 text-xs font-black uppercase tracking-[0.2em] mb-2">
//               <Users size={16} />
//               Group Adventures
//             </div>
//             <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Group Trips</h1>
//             <p className="text-slate-500 font-medium mt-2">Join a group, plan together, and travel with fellow explorers.</p>
//           </div>
//           <button
//             onClick={() => navigate('/onboarding')}
//             className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 shadow-xl shadow-slate-200 hover:bg-blue-600 transition-colors"
//           >
//             <Zap size={18} />
//             Create Group Trip
//           </button>
//         </div>
//       </header>

//       <div className="grp-card grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
//         <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
//           <p className="text-3xl font-black text-blue-700">{groupTripsData.length}</p>
//           <p className="text-sm font-semibold text-blue-600 mt-1">Active Groups</p>
//         </div>
//         <div className="p-6 rounded-2xl bg-green-50 border border-green-100">
//           <p className="text-3xl font-black text-green-700">
//             {groupTripsData.reduce((sum, g) => sum + g.members.length, 0)}
//           </p>
//           <p className="text-sm font-semibold text-green-600 mt-1">Total Travelers</p>
//         </div>
//         <div className="p-6 rounded-2xl bg-amber-50 border border-amber-100">
//           <p className="text-3xl font-black text-amber-700">
//             {groupTripsData.reduce((sum, g) => sum + g.maxMembers - g.members.length, 0)}
//           </p>
//           <p className="text-sm font-semibold text-amber-600 mt-1">Open Spots</p>
//         </div>
//       </div>

//       <div className="space-y-6">
//         {groupTripsData.map((group) => {
//           const onlineCount = group.members.filter((m) => m.online).length;
//           const spotsLeft = group.maxMembers - group.members.length;

//           return (
//             <motion.div
//               key={group.id}
//               whileHover={{ y: -3 }}
//               onClick={() => navigate(`/group/${group.id}`)}
//               className="grp-card bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-blue-500/5 cursor-pointer transition-shadow"
//             >
//               <div className="flex flex-col lg:flex-row">
//                 <div className="lg:w-64 h-48 lg:h-auto">
//                   <img src={group.image} alt={group.name} className="w-full h-full object-cover" />
//                 </div>

//                 <div className="flex-1 p-6 lg:p-8">
//                   <div className="flex items-start justify-between mb-3">
//                     <div>
//                       <div className="flex items-center gap-2 mb-1">
//                         <h3 className="text-xl font-black text-slate-900">{group.name}</h3>
//                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[group.status]}`}>
//                           {group.status}
//                         </span>
//                       </div>
//                       <div className="flex items-center gap-3 text-sm text-slate-500">
//                         <span className="flex items-center gap-1"><MapPin size={14} /> {group.destination}</span>
//                         <span className="flex items-center gap-1"><Calendar size={14} /> {group.startDate}</span>
//                       </div>
//                     </div>
//                     <ArrowRight size={20} className="text-slate-300 mt-1" />
//                   </div>

//                   <div className="flex flex-wrap gap-2 mb-4">
//                     {group.tags.map((tag) => (
//                       <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold">{tag}</span>
//                     ))}
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-4">
//                       <div className="flex -space-x-2">
//                         {group.members.slice(0, 5).map((m) => (
//                           <div
//                             key={m.id}
//                             className={`h-9 w-9 rounded-full flex items-center justify-center text-xs font-bold border-2 border-white ${
//                               m.role === 'organizer' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-700'
//                             }`}
//                             title={`${m.name}${m.role === 'organizer' ? ' (Organizer)' : ''}`}
//                           >
//                             {m.avatar}
//                           </div>
//                         ))}
//                         {group.members.length > 5 && (
//                           <div className="h-9 w-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold border-2 border-white text-slate-500">
//                             +{group.members.length - 5}
//                           </div>
//                         )}
//                       </div>

//                       <div className="text-sm">
//                         <p className="font-bold text-slate-800">
//                           {group.members.length}/{group.maxMembers} members
//                         </p>
//                         <p className="text-xs text-slate-400">
//                           {onlineCount} online • {spotsLeft > 0 ? `${spotsLeft} spots left` : 'Full'}
//                         </p>
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <p className="text-xs font-bold text-slate-400">Budget</p>
//                       <p className="text-lg font-black text-slate-900">
//                         {group.budget.currency}{group.budget.total.toLocaleString()}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default GroupTrips;


import React from 'react'

const GroupTrips = () => {
  return (
    <div>
      
    </div>
  )
}

export default GroupTrips
