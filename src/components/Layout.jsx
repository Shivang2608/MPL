import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ children, currentPage, setPage }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        setPage={setPage}
        isOpen={isOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* MAIN PAGE */}
      <div className="flex flex-col flex-1 md:ml-64">

        {/* Topbar */}
        <Topbar toggleSidebar={toggleSidebar} />

        {/* CONTENT */}
        <main className="mt-16 p-4 overflow-y-auto h-[calc(100vh-64px)]">
          {children}
        </main>
      </div>
    </div>
  );
}
