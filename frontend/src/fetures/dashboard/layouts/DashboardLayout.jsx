import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
  const location = useLocation();
  const isWorkspaceRoute = location.pathname === '/workspace';

  return (
    <div className="flex h-screen bg-[#f8f3ea] overflow-hidden">
      <Sidebar /> 

      <main className="flex-1 overflow-y-auto custom-scrollbar bg-[#f8f3ea]">
        <div className={isWorkspaceRoute ? 'min-h-full' : 'p-6 md:p-10'}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;