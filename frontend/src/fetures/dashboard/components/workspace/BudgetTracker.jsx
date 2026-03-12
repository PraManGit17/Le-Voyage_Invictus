import React from 'react';
import { Wallet } from 'lucide-react';

const formatCurrency = (amount) => `$${Number(amount || 0).toLocaleString()}`;

const BudgetTracker = ({ budget }) => {
  const total = budget?.total || 0;
  const spent = budget?.spent || 0;
  const percent = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

  return (
    <div className="p-8 bg-slate-900 text-white rounded-[2.5rem] shadow-xl relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-8">
          <div className="p-3 bg-white/10 rounded-2xl">
            <Wallet size={24} className="text-blue-400" />
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Total Budget</p>
            <p className="text-2xl font-black tracking-tight text-white">{formatCurrency(total)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-slate-400">Spent: {formatCurrency(spent)}</span>
              <span className="text-blue-400">{percent}%</span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Remaining</p>
              <p className="font-bold">{formatCurrency(Math.max(total - spent, 0))}</p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <p className="text-[9px] uppercase font-bold text-slate-400 mb-1">Estimated</p>
              <p className="font-bold">{formatCurrency(budget?.estimated || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full -mr-16 -mt-16" />
    </div>
  );
};

export default BudgetTracker;
