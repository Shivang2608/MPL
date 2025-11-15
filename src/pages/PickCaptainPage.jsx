// src/pages/PickCaptainPage.jsx
import React, { useState } from "react";

export default function PickCaptainPage({ selectedPlayers, selectedMatch, onSaveTeam, setPage, editingTeam }) {
  const [captainId, setCaptainId] = useState(editingTeam?.captain?.id || null);
  const [viceCaptainId, setViceCaptainId] = useState(editingTeam?.viceCaptain?.id || null);

  if (!selectedPlayers || !selectedPlayers.length) {
    return (
      <div className="p-6 text-center">
        <p>No players selected. Please pick players first.</p>
        <button
          onClick={() => setPage({ page: "PICK_PLAYERS", data: null })}
          className="mt-4 px-3 py-2 border rounded"
        >
          Go back
        </button>
      </div>
    );
  }
  const handleSave = () => {
  if (!captainId || !viceCaptainId) {
    return alert("Please select both Captain and Vice-Captain.");
  }

  const captain = selectedPlayers.find(p => p.id === captainId || p.player_id === captainId);
  const viceCaptain = selectedPlayers.find(p => p.id === viceCaptainId || p.player_id === viceCaptainId);

  const teamObj = {
    id: editingTeam?.id || `team_${Date.now()}`,
    players: selectedPlayers,
    matchId: selectedMatch?.id,
    createdAt: new Date().toISOString(),
    creditsLeft: 100 - selectedPlayers.reduce((s, p) => s + Number(p.credit || p.value || p.cost || 0), 0),
    captain,
    viceCaptain
  };

  // Save the team via callback
  if (typeof onSaveTeam === "function") onSaveTeam(teamObj);

  // Navigate to My Teams page with the new team
  setPage({ page: "MY_TEAMS", data: teamObj });
};

 

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        Pick Captain & Vice-Captain — {selectedMatch?.match_name || selectedMatch?.team_a_short + ' vs ' + selectedMatch?.team_b_short}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {selectedPlayers.map(player => {
          const id = player.id || player.player_id;
          const name = player.player_name || player.name || player.player_full_name || `Player ${id}`;
          const role = (player.role || player.position || player.player_role || 'NA');
          const team = player.team || player.team_short || player.team_name || 'TEAM';

          const isCaptain = captainId === id;
          const isViceCaptain = viceCaptainId === id;

          const optionStyle = "px-2 py-1 rounded cursor-pointer text-sm";
          const selectedStyle = "bg-red-600 text-white";

          return (
            <div key={id} className="p-3 border rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-gray-500">{role} • {team}</div>
              </div>

              {/* Captain & Vice-Captain horizontal with highlight */}
              <div className="mt-2 flex items-center justify-between space-x-2">
                <div
                  onClick={() => setCaptainId(id)}
                  className={`${optionStyle} ${isCaptain ? selectedStyle : "border border-gray-300"} ${isViceCaptain ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Captain
                </div>

                <div
                  onClick={() => setViceCaptainId(id)}
                  className={`${optionStyle} ${isViceCaptain ? selectedStyle : "border border-gray-300"} ${isCaptain ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  Vice-Captain
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          onClick={() => setPage({ page: "PICK_PLAYERS", data: { players: selectedPlayers, match: selectedMatch } })}
          className="px-4 py-2 border rounded text-sm"
        >
          Back
        </button>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-red-600 text-white rounded text-sm"
        >
          Save Team
        </button>
      </div>
    </div>
  );
}
