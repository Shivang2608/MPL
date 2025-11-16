import React from 'react';

// Placeholder SVGs for the icons
const BellIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.93 6 11v5l-2 2v1h16v-1l-2-2z" /></svg>
);
const UserIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
);
const WalletIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" /></svg>
);
const MenuIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
);


export default function TopBar({ toggleSidebar }) {
  return (
    <header className="h-16 bg-white shadow-md flex items-center justify-between px-4 md:px-8 sticky top-0 z-20">
      
      {/* Mobile Hamburger Button (Visible only on small screens) */}
      <button 
        onClick={toggleSidebar} 
        className="text-gray-700 hover:text-red-500 md:hidden p-2 rounded-lg"
      >
        <MenuIcon className="w-7 h-7" />
      </button>

      {/* Placeholder for center logo on mobile */}
      <div className="md:hidden">
         <h1 className="text-xl font-bold text-red-500">APNATEAM <span className="text-gray-800 text-base">11</span></h1>
      </div>

      <div className="flex items-center space-x-6">
        {/* Wallet Button */}
        <button className="flex items-center px-4 py-2 bg-gray-100 rounded-lg text-sm font-semibold hover:bg-gray-200 transition-colors">
          <WalletIcon className="w-5 h-5 mr-2 text-green-600" />
          ₹ 12,120.99
        </button>
        
        {/* Icons */}
        <button className="text-gray-500 hover:text-red-500 transition-colors">
          <BellIcon className="w-6 h-6" />
        </button>
        <button className="text-gray-500 hover:text-red-500 transition-colors">
          <UserIcon className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}