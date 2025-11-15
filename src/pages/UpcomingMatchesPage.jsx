import React, { useState, useEffect } from 'react';

// --- Constants ---
const API_URLS = {
  matches: 'https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_upcoming_Matches.json',
};
const PLACEHOLDER_IMG = 'https://placehold.co/100x100/CCCCCC/333333?text=';

// --- Helper Components ---
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-40 col-span-2">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="p-4 bg-red-100 text-red-700 rounded-lg text-center m-4 col-span-2">
    {message}
  </div>
);

// --- MatchCard Component (Styled for Desktop) ---
const MatchCard = ({ match, onSelect }) => {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    return `${day} ${month}`;
  };

  return (
    <button 
      onClick={() => onSelect(match)} 
      className="w-full bg-white rounded-lg shadow-md p-4 text-left transition-transform hover:shadow-lg border-t-4 border-red-600"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-500">{match.match_name}</span>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{formatTime(match.start_date)}</p>
          <p className="text-xs text-red-500">{formatDate(match.start_date)}</p>
        </div>
      </div>
      
      {/* Team 1 */}
      <div className="flex items-center space-x-3 mb-2">
        <img 
          src={match.team_a_logo} 
          alt={match.team_a_short} 
          className="w-8 h-8 object-contain"
          onError={(e) => e.target.src = `${PLACEHOLDER_IMG}${match.team_a_short}`}
        />
        <span className="font-semibold text-gray-700">{match.team_a_name || match.team_a_short}</span>
      </div>
      
      {/* Team 2 */}
      <div className="flex items-center space-x-3 mb-4">
        <img 
          src={match.team_b_logo} 
          alt={match.team_b_short} 
          className="w-8 h-8 object-contain"
          onError={(e) => e.target.src = `${PLACEHOLDER_IMG}${match.team_b_short}`}
        />
        <span className="font-semibold text-gray-700">{match.team_b_name || match.team_b_short}</span>
      </div>

      {/* Footer tags */}
      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
         <div>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-medium">₹58 crores</span>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium ml-2">MEGA</span>
         </div>
         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
         </svg>
      </div>
    </button>
  );
};

// --- Main Page Component ---

export default function UpcomingMatchesPage({ onSelectMatch }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
useEffect(() => {
  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_URLS.matches);
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();

      // Check if cricket matches exist
      const cricketMatches = data?.matches?.cricket || [];

      // Map to a consistent object shape
      const matchesArray = cricketMatches.map(m => ({
        id: m.id,
        match_name: m.match_name,
        team_a_name: m.t1_name,
        team_b_name: m.t2_name,
        team_a_short: m.t1_short_name,
        team_b_short: m.t2_short_name,
        team_a_logo: m.t1_image,
        team_b_logo: m.t2_image,
        start_date: m.match_date,
        match_type: m.match_type,
      }));

      setMatches(matchesArray);
    } catch (e) {
      setError('Failed to fetch matches. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  fetchMatches();
}, []);


  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* New Banner Image */}
      <div className="mb-6">
        <img 
          src="https://placehold.co/1200x250/E11A2B/FFFFFF?text=IPL+2025+TEAM+HAI+TOH+MAZAA+HAI&font=lato" 
          alt="Banner" 
          className="w-full rounded-lg shadow-lg"
        />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Matches</h2>
      
      {/* Loading and Error states applied to the grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
      
        {!loading && !error && matches.map(match => (
          <MatchCard 
            key={match.id} 
            match={match} 
            onSelect={onSelectMatch}
          />
        ))}
      </div>
    </div>
  );
}