import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

export default function Layout({ children, currentPage, setPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex">
      
      {/* Sidebar */}
      <Sidebar 
        currentPage={currentPage}
        setPage={setPage}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64">
        <TopBar toggleSidebar={toggleSidebar} />
        
        {/* Page Content */}
        <div className="p-4">
          {children}
        </div>
      </div>

    </div>
  );
}
