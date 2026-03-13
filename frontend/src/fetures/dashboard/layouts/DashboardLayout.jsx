import React from 'react';
import Sidebar from '../components/Sidebar';

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar /> 

      <main className="flex-1 overflow-y-auto custom-scrollbar" style={{ backgroundColor: '#ffffff' }}>
        <div className="p-8 md:p-12">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;