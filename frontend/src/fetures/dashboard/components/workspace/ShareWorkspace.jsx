import React, { useState } from 'react';
import { Copy, Check, Users, Shield } from 'lucide-react';

const ShareWorkspace = () => {
  const [copied, setCopied] = useState(false);
  const inviteLink = "wayfarer.ai/join/tokyo-spring-2026";

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <Users size={20} />
        </div>
        <h3 className="text-xl font-bold">Invite Partners</h3>
      </div>

      <p className="text-slate-500 text-sm mb-6 leading-relaxed">
        Shared trip workspaces allow everyone to vote on activities and manage the group budget.
      </p>

      <div className="relative mb-6">
        <input 
          readOnly 
          value={inviteLink}
          className="w-full pl-4 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-mono text-slate-500 focus:outline-none"
        />
        <button 
          onClick={handleCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 hover:text-blue-600 transition-colors"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </button>
      </div>

      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        <Shield size={12} />
        <span>Only invited members can edit</span>
      </div>
    </div>
  );
};

export default ShareWorkspace;