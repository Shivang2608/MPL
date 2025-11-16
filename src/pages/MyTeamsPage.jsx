// src/pages/MyTeamsPage.jsx
import React, { useState } from "react";
import { Pencil } from "lucide-react";

export default function MyTeamsPage({
  myTeams = [],
  match,
  setPage,
  setSelectedForEdit,
}) {
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

      {/* MY TEAMS */}
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
            <p className="text-gray-500 text-center">
              You have not created any teams yet.
            </p>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {myTeams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onEdit={() => setSelectedForEdit(team)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CONTESTS */}
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

/* --------------------------------------------------------
   TEAM CARD — FIXED ROLE DETECTION & IMAGE FALLBACK
--------------------------------------------------------- */
function TeamCard({ team, onEdit }) {
  const captain = team.captain;
  const viceCaptain = team.viceCaptain;

  const roleCount = { WK: 0, BAT: 0, AR: 0, BOWL: 0 };

  const detectRole = (role) => {
    const r = (role || "").toLowerCase();

    if (r.includes("wk") || r.includes("wicket")) return "WK";
    if (r.includes("bat")) return "BAT";
    if (r.includes("ar") || r.includes("all")) return "AR";
    if (r.includes("bowl")) return "BOWL";

    return null;
  };

  team.players.forEach((p) => {
    const detected = detectRole(p.role);
    if (detected) roleCount[detected]++;
  });

  const getImage = (p) =>
    p.player_image ||
    p.image ||
    p.logo ||
    p.team_logo ||
    p.team_image ||
    "https://placehold.co/80x80?text=IMG";

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition">
      {/* Header */}
      <div className="flex justify-between items-center bg-green-100 p-3">
        <h3 className="font-bold text-lg">Team ({team.id.split("_")[1]})</h3>
        <button onClick={onEdit} className="text-gray-500 hover:text-red-600">
          <Pencil size={18} />
        </button>
      </div>

      {/* Captain + VC */}
      <div className="bg-red-600 text-white py-6 px-4 flex justify-center gap-8">
        {[captain, viceCaptain].map(
          (p, idx) =>
            p && (
              <div key={idx} className="relative flex flex-col items-center">
                <img
                  src={getImage(p)}
                  onError={(e) =>
                    (e.target.src = "https://placehold.co/80x80?text=IMG")
                  }
                  alt={p.player_name}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white"
                />

                <div
                  className={`absolute -top-1 -right-2 text-white text-xs font-bold px-1 rounded ${
                    idx === 0 ? "bg-green-600" : "bg-orange-600"
                  }`}
                >
                  {idx === 0 ? "C" : "VC"}
                </div>

                <span className="mt-2 text-xs bg-white text-black px-2 py-1 rounded">
                  {p.player_name}
                </span>
              </div>
            )
        )}
      </div>

      {/* ROLE COUNT */}
      <div className="flex justify-around text-sm font-semibold text-gray-700 bg-gray-50 py-3">
        <span>
          WK <strong>{roleCount.WK}</strong>
        </span>
        <span>
          BAT <strong>{roleCount.BAT}</strong>
        </span>
        <span>
          AR <strong>{roleCount.AR}</strong>
        </span>
        <span>
          BOWL <strong>{roleCount.BOWL}</strong>
        </span>
      </div>
    </div>
  );
}
