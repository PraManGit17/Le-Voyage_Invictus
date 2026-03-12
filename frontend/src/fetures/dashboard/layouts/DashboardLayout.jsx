import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar /> 

      <main className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;