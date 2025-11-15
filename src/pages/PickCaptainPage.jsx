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
    if (captainId === viceCaptainId) {
      return alert("Captain and Vice-Captain cannot be the same player.");
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

    if (typeof onSaveTeam === "function") onSaveTeam(teamObj);
    alert("Team saved with Captain & Vice-Captain!");
    setPage({ page: "MY_TEAMS", data: null });
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

          return (
            <div key={id} className="p-3 border rounded-lg shadow-sm flex flex-col justify-between">
              <div>
                <div className="font-semibold">{name}</div>
                <div className="text-xs text-gray-500">{role} • {team}</div>
              </div>

              <div className="mt-2 flex flex-col space-y-1">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="captain"
                    checked={captainId === id}
                    onChange={() => setCaptainId(id)}
                  />
                  <span className="text-sm">Captain</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="viceCaptain"
                    checked={viceCaptainId === id}
                    onChange={() => setViceCaptainId(id)}
                  />
                  <span className="text-sm">Vice-Captain</span>
                </label>
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
