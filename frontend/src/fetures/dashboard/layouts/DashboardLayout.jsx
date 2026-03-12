import React from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const isWorkspace = location.pathname === "/workspace";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto no-scrollbar">
        <div className={isWorkspace ? "" : "p-8 md:p-12"}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;