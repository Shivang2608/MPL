import React, { useState, useEffect } from 'react';

// --- Constants ---
const API_URLS = {
  matches:
    'https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_upcoming_Matches.json',
};

const PLACEHOLDER_IMG =
  'https://placehold.co/100x100/CCCCCC/333333?text=';

// Slideshow images
const BANNERS = [
  "http://localhost:3000/bannerimagea.png",
  "http://localhost:3000/bannerimage2.jpeg",
  "http://localhost:3000/bannerimage3.jpg"
];

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

// --- MatchCard Component ---
const MatchCard = ({ match, onSelect }) => {
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12;
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
      className="w-full bg-white rounded-lg shadow-md p-4 text-left hover:shadow-lg border-t-4 border-red-600 transition-transform"
    >
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-500">{match.match_name}</span>
        <div className="text-right">
          <p className="text-sm font-semibold text-gray-800">{formatTime(match.start_date)}</p>
          <p className="text-xs text-red-500">{formatDate(match.start_date)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 mb-2">
        <img
          src={match.team_a_logo}
          className="w-8 h-8 object-contain"
          onError={(e) => (e.target.src = `${PLACEHOLDER_IMG}${match.team_a_short}`)}
        />
        <span className="font-semibold text-gray-800">{match.team_a_name}</span>
      </div>

      <div className="flex items-center space-x-3 mb-4">
        <img
          src={match.team_b_logo}
          className="w-8 h-8 object-contain"
          onError={(e) => (e.target.src = `${PLACEHOLDER_IMG}${match.team_b_short}`)}
        />
        <span className="font-semibold text-gray-800">{match.team_b_name}</span>
      </div>

      <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
        <div>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">₹58 crores</span>
          <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full ml-2">MEGA</span>
        </div>
      </div>
    </button>
  );
};

// --- Main Page Component ---
export default function UpcomingMatchesPage({ onSelectMatch }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Slideshow state
  const [slide, setSlide] = useState(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setSlide((prev) => (prev + 1) % BANNERS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(API_URLS.matches);
        const data = await res.json();
        const cricketMatches = data?.matches?.cricket || [];

        const formatted = cricketMatches.map((m) => ({
          id: m.id,
          match_name: m.match_name,
          team_a_name: m.t1_name,
          team_b_name: m.t2_name,
          team_a_short: m.t1_short_name,
          team_b_short: m.t2_short_name,
          team_a_logo: m.t1_image,
          team_b_logo: m.t2_image,
          start_date: m.match_date,
        }));

        setMatches(formatted);
      } catch (err) {
        setError("Failed to load matches.");
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto">
      
      {/* 🔥 SLIDESHOW BANNER */}
      <div className="relative w-full h-56 md:h-64 overflow-hidden rounded-xl shadow-lg mb-6">
        
        {/* Slides */}
        <div
          className="flex transition-transform duration-700"
          style={{
            transform: `translateX(-${slide * 100}%)`,
          }}
        >
          {BANNERS.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full flex-shrink-0 h-56 md:h-64 object-cover"
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {BANNERS.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                slide === i ? "bg-white scale-125" : "bg-gray-400 opacity-70"
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upcoming Matches</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} />}
        {!loading &&
          !error &&
          matches.map((match) => (
            <MatchCard key={match.id} match={match} onSelect={onSelectMatch} />
          ))}
      </div>
    </div>
  );
}
