import React from 'react';

// Placeholder SVGs for the icons
const HomeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" /></svg>
);
const TrophyIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M18.4 0H5.6C4.7 0 4 .7 4 1.6v.8C4 4.1 5.9 6 8.4 6H12v2H8.4C5.9 8 4 9.9 4 12.4v.8C4 14.1 4.7 14.8 5.6 14.8H6v4.4c0 2.5 2.1 4.8 4.8 4.8h.4c2.5 0 4.8-2.1 4.8-4.8V14.8h.4c.9 0 1.6-.7 1.6-1.6v-.8c0-2.5-1.9-4.4-4.4-4.4H12V6h3.6c2.5 0 4.4-1.9 4.4-4.4V1.6C20 .7 19.3 0 18.4 0zM12 22c-1.8 0-3.2-1.4-3.2-3.2V14.8h6.4v4c0 1.8-1.4 3.2-3.2 3.2zM18.4 4.4C18.4 5.3 17.7 6 16.8 6H7.2C6.3 6 5.6 5.3 5.6 4.4V1.6h12.8v2.8z" /></svg>
);
const CoinIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5S10.62 9.5 12 9.5s2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
);
const GiftIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M20 6h-3.17c.07-1.01-.16-2.01-.6-2.88C15.8 2.5 15.1 2 14.2 2c-1.1 0-2.1.8-2.2 1.9L12 4l-.1-.1C11.8 2.8 10.8 2 9.8 2c-.9 0-1.6.5-2.1 1.12-.4.87-.7 1.87-.6 2.88H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8-2c.4 0 .8.4.8.8V6H8.8c.2-1.3.8-2.4 1.2-2.8.4-.4.8-.8 1.2-.8.4 0 .8.3.8.8V6h-1.2c-.4-1.2-.8-2-1.6-2 .4 0 .8.4.8.8zM4 8h16v12H4V8zm7 10h2v-4h4v-2h-4V8h-2v4H5v2h6v4z" /></svg>
);
const CloseIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default function Sidebar({ currentPage, setPage, isOpen, toggleSidebar }) {
  const menuItems = [
    { name: 'Home', icon: HomeIcon, page: 'MATCHES' },
    { name: 'My Matches', icon: TrophyIcon, page: 'MY_TEAMS' },
    { name: 'GamizoCoins', icon: CoinIcon, page: 'COINS' },
    { name: 'Refer & Win', icon: GiftIcon, page: 'REFER' },
    { name: 'Games', icon: TrophyIcon, page: 'GAMES' },
  ];

  return (
    <div 
      // Responsive logic: Slides in/out on mobile, always visible on desktop (md:static)
     className={`
  w-64 bg-gray-900 text-white flex flex-col h-screen 
  fixed md:static top-0 left-0 z-50 
  transition-transform duration-300

  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
  md:translate-x-0
`}
    >
      {/* Logo and Close Button (Mobile Only) */}
      <div className="h-16 flex items-center px-4 bg-black justify-between">
        <h1 className="text-2xl font-bold text-red-500">GAMIZO <span className="text-white text-base">11</span></h1>
        
        {/* Close Button on Mobile */}
        <button 
          onClick={toggleSidebar} 
          className="p-2 md:hidden text-gray-400 hover:text-white"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => {
              setPage(item.page)
              if (isOpen) toggleSidebar() // Close on click if mobile
            }}
            className={`flex items-center w-full px-4 py-3 rounded-lg transition-colors ${
              currentPage === item.page
                ? 'bg-red-600 text-white font-semibold'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium">{item.name}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}