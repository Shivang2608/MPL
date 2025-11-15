// src/pages/MyTeamsPage.jsx
import React, { useState } from "react";
import { Pencil } from "lucide-react";

export default function MyTeamsPage({ myTeams = [], match, setPage, setSelectedForEdit }) {
  const [activeTab, setActiveTab] = useState("MY_TEAMS");

  const contests = [
    { prize: 1000, entry: 10, spots: 100, winners: 10 },
    { prize: 2000, entry: 10, spots: 200, winners: 20 },
    { prize: 3000, entry: 10, spots: 300, winners: 30 },
    { prize: 4000, entry: 10, spots: 400, winners: 40 },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("CONTESTS")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "CONTESTS"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-gray-500"
          }`}
        >
          Contests
        </button>
        <button
          onClick={() => setActiveTab("MY_TEAMS")}
          className={`px-4 py-2 font-semibold ${
            activeTab === "MY_TEAMS"
              ? "border-b-2 border-red-600 text-red-600"
              : "text-gray-500"
          }`}
        >
          My Teams
        </button>
      </div>

      {activeTab === "MY_TEAMS" && (
        <div className="space-y-6">
          <button
            onClick={() =>
              setPage({ page: "PICK_PLAYERS", data: { selectedMatch: match } })
            }
            className="mb-4 px-4 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition"
          >
            + Create Team
          </button>

          {myTeams.length === 0 ? (
            <p className="text-gray-500 text-center">You have not created any teams yet.</p>
          ) : (
            <div className="space-y-4">
              {myTeams.map((team) => (
                <TeamCard key={team.id} team={team} onEdit={() => setSelectedForEdit(team)} />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "CONTESTS" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contests.map((c, idx) => (
            <div
              key={idx}
              className="relative bg-gradient-to-b from-red-50 to-white rounded-xl shadow-lg p-4 flex flex-col justify-between hover:shadow-2xl transition"
            >
              <div className="mb-3">
                <h3 className="text-xl font-bold text-red-600">₹{c.prize}</h3>
                <p className="text-sm text-gray-600">Entry ₹{c.entry}</p>
              </div>
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>{c.spots} spots</span>
                  <span>{c.spots} left</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: "0%" }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">0% filled</p>
              </div>
              <p className="text-xs text-gray-500 mb-2">{c.winners} Winners</p>
              <button
                onClick={() =>
                  setPage({
                    page: "PICK_PLAYERS",
                    data: { selectedMatch: match, contest: c },
                  })
                }
                className="mt-auto px-3 py-2 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition"
              >
                Join Contest
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Team card showing only C/VC avatars with badges & vertical team counts
function TeamCard({ team, onEdit }) {
  const captain = team.captain;
  const viceCaptain = team.viceCaptain;

  // Count of players per team
  const teamCount = {};
  team.players.forEach((p) => {
    const tShort = p.team_short || "TEAM";
    teamCount[tShort] = (teamCount[tShort] || 0) + 1;
  });

  return (
    <div className="relative bg-white rounded-xl shadow-lg p-4 hover:shadow-2xl transition">
      {/* Pencil icon */}
      <button
        onClick={onEdit}
        className="absolute top-3 right-3 text-gray-400 hover:text-red-600"
      >
        <Pencil size={18} />
      </button>

      <h3 className="font-bold text-lg mb-4">Team {team.id.split("_")[1]}</h3>

      <div className="flex items-center gap-6">
        {/* C/VC Avatars */}
        {[captain, viceCaptain].map((p, idx) => {
          if (!p) return null;
          return (
            <div key={idx} className="relative w-16 h-16">
              {/* Jersey image */}
              <img
                src={p.image || "/jersey-placeholder.png"}
                alt={p.player_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              {/* Badge C or VC */}
              <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold px-1 rounded">
                {idx === 0 ? "C" : "VC"}
              </div>
            </div>
          );
        })}

        {/* Team counts vertical */}
        <div className="mt-4 flex justify-start items-center gap-6 text-gray-700 font-semibold">
          {Object.entries(teamCount).map(([teamShort, count]) => (
            
            <span key={teamShort}>
              {teamShort} {count}
            </span>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-3">Credits Left: {team.creditsLeft}</div>
    </div>
  );
}
