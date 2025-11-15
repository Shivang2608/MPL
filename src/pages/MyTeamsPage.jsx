// src/pages/MyTeamsPage.jsx
import React from 'react';

export default function MyTeamsPage({ match, teams = [], onEdit, onDelete, setPage, setSelectedForEdit }) {
  const teamsForMatch = teams.filter(t => t.matchId === (match?.id));

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">My Teams — {match?.match_name || 'Selected Match'}</h2>
        <button onClick={() => setPage('PICK_PLAYERS')} className="px-3 py-2 border rounded">Create Team</button>
      </div>

      {!teamsForMatch.length && <div className="p-6 bg-white rounded shadow text-center text-gray-600">No teams created yet for this match.</div>}

      <div className="grid gap-4">
        {teamsForMatch.map(t => (
          <div key={t.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">Team ID: {t.id}</div>
              <div className="text-sm text-gray-500">Players: {t.players?.length || 0} • Created: {new Date(t.createdAt).toLocaleString()}</div>
              <div className="text-sm">Captain: {t.captain?.player_name || t.captain?.name || '—'} • Vice: {t.viceCaptain?.player_name || t.viceCaptain?.name || '—'}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setSelectedForEdit(t); setPage('PICK_PLAYERS'); }} className="px-3 py-1 border rounded text-sm">Edit</button>
              <button onClick={() => onDelete(t.id)} className="px-3 py-1 border rounded text-sm">Delete</button>
              <button onClick={() => { alert(JSON.stringify(t, null, 2)); }} className="px-3 py-1 border rounded text-sm">View</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
