import React, { useEffect, useState, useMemo } from 'react';
import { fetchPlayersForMatch } from '../lib/api';

const ROLE_LABELS = {
  BAT: 'Batsman',
  BOWL: 'Bowler',
  AR: 'AllRounder',
  WK: 'Wicketkeeper',
};

const DEFAULT_CREDITS = 100;
const MAX_PLAYERS = 11;

function summaryCounts(players) {
  const counts = { total: 0, teams: {}, roles: { BAT: 0, BOWL: 0, AR: 0, WK: 0 }, creditsUsed: 0 };
  players.forEach(p => {
    counts.total++;
    const team = p.team || p.team_short || p.team_name || 'TEAM';
    counts.teams[team] = (counts.teams[team] || 0) + 1;

    const roleStr = (p.role || p.position || p.player_role || '').toUpperCase().replace('-', '').replace(' ', '');

if (roleStr.includes('BAT')) counts.roles.BAT++;
else if (roleStr.includes('BOWL')) counts.roles.BOWL++;
else if (roleStr.includes('AR') || roleStr.includes('ALLROUNDER')) counts.roles.AR++;
else if (roleStr.includes('WK') || roleStr.includes('WICKETKEEPER')) counts.roles.WK++;


    counts.creditsUsed += Number(p.credit || p.value || p.cost || 0);
  });
  return counts;
}


export default function PickPlayersPage({ selectedMatch, onSaveTeam, setPage, prefillTeam }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ role: 'ALL', team: 'ALL', search: '' });
  const [selectedPlayers, setSelectedPlayers] = useState(prefillTeam?.players || []);
  const [creditsLeft, setCreditsLeft] = useState(DEFAULT_CREDITS);

  useEffect(() => {
    if (!selectedMatch) return;
    setLoading(true);
    fetchPlayersForMatch(selectedMatch.id)
      .then(data => {
        const arr = Array.isArray(data) ? data : Object.keys(data || {}).map(k => ({ id: k, ...data[k] }));
        setPlayers(arr);
      })
      .finally(() => setLoading(false));
  }, [selectedMatch]);

  useEffect(() => {
    const used = selectedPlayers.reduce((s, p) => s + Number(p.credit || p.value || p.cost || 0), 0);
    setCreditsLeft(DEFAULT_CREDITS - used);
  }, [selectedPlayers]);

  const counts = useMemo(() => summaryCounts(selectedPlayers), [selectedPlayers]);

  const roleValid = () => {
    const r = counts.roles;
    return (
      r.BAT >= 3 && r.BAT <= 7 &&
      r.WK >= 1 && r.WK <= 5 &&
      r.AR >= 0 && r.AR <= 4 &&
      r.BOWL >= 3 && r.BOWL <= 7 &&
      counts.total === MAX_PLAYERS
    );
  };

  const canSelectPlayer = (p) => {
    if (selectedPlayers.find(sp => sp.id === p.id || sp.player_id === p.player_id)) return false;
    if (selectedPlayers.length >= MAX_PLAYERS) return false;
    const team = p.team || p.team_short || p.team_name || p.teamId || 'TEAM';
    const teamCount = selectedPlayers.filter(sp => (sp.team || sp.team_short || sp.team_name || sp.teamId || 'TEAM') === team).length;
    if (teamCount >= 7) return false;
    const credit = Number(p.credit || p.value || p.cost || 0);
    const used = selectedPlayers.reduce((s, x) => s + Number(x.credit || x.value || x.cost || 0), 0);
    return (used + credit) <= DEFAULT_CREDITS;
  };

  const toggleSelect = (p) => {
    const found = selectedPlayers.find(sp => sp.id === p.id || sp.player_id === p.player_id);
    if (found) {
      setSelectedPlayers(selectedPlayers.filter(sp => !(sp.id === p.id || sp.player_id === p.player_id)));
      return;
    }
    if (!canSelectPlayer(p)) return;
    setSelectedPlayers([...selectedPlayers, p]);
  };

  const filtered = players.filter(p => {
    const role = (p.role || p.position || p.player_role || '').toUpperCase();
    if (filters.role !== 'ALL') {
      if (filters.role === 'BAT' && !role.includes('BAT')) return false;
      if (filters.role === 'BOWL' && !role.includes('BOWL')) return false;
      if (filters.role === 'AR' && !role.includes('AR')) return false;
      if (filters.role === 'WK' && !role.includes('WK')) return false;
    }
    const team = p.team || p.team_short || p.team_name || '';
    if (filters.team !== 'ALL' && filters.team !== team) return false;
    if (filters.search && !String(p.player_name || p.name || p.player_full_name || '').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const uniqueTeams = Array.from(new Set(players.map(p => p.team || p.team_short || p.team_name).filter(Boolean)));

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Create Team — {selectedMatch?.match_name || selectedMatch?.team_a_short + ' vs ' + selectedMatch?.team_b_short}</h2>
          <p className="text-sm text-gray-500">Pick 11 players under 100 credits. Roles: 3-7 BAT, 1-5 WK, 0-4 AR, 3-7 BOWL</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setPage({ page: 'MATCHES', data: null })} className="px-3 py-2 border rounded-md text-sm">Back</button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-1 md:col-span-3">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <select value={filters.role} onChange={(e)=>setFilters(f=>({...f, role:e.target.value}))} className="px-3 py-2 border rounded">
              <option value="ALL">All Roles</option>
              <option value="BAT">Batsman</option>
              <option value="WK">Wicketkeeper</option>
              <option value="AR">All-Rounder</option>
              <option value="BOWL">Bowler</option>
            </select>

            <select value={filters.team} onChange={(e)=>setFilters(f=>({...f, team:e.target.value}))} className="px-3 py-2 border rounded">
              <option value="ALL">All Teams</option>
              {uniqueTeams.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            <input value={filters.search} onChange={(e)=>setFilters(f=>({...f, search:e.target.value}))} placeholder="Search player" className="px-3 py-2 border rounded flex-1" />
          </div>

          {/* Players Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {loading && <div className="col-span-3 p-6 text-center">Loading players...</div>}
            {!loading && !filtered.length && <div className="col-span-3 p-6 text-center text-gray-500">No players found</div>}
            {!loading && filtered.map(p => {
              const selected = !!selectedPlayers.find(sp => sp.id === p.id || sp.player_id === p.player_id);
              const disabled = !selected && !canSelectPlayer(p);
              const credit = Number(p.credit || p.value || p.cost || 0);
              const role = (p.role || p.position || p.player_role || 'NA');
              const name = p.player_name || p.name || p.player_full_name || `Player ${p.id}`;
              const team = p.team || p.team_short || p.team_name || 'TEAM';
              return (
                <button key={p.id || p.player_id} onClick={()=>toggleSelect(p)} disabled={disabled}
                  className={`text-left p-3 rounded-lg shadow-sm border ${selected ? 'bg-red-50 border-red-400' : 'bg-white hover:shadow'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{name}</div>
                      <div className="text-xs text-gray-500">{role} • {team}</div>
                    </div>
                    <div className="text-sm font-medium">{credit}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: summary + actions */}
        <div className="col-span-1">
          <div className="bg-gray-50 rounded p-3 shadow-inner">
            <h3 className="font-semibold mb-2">Team Summary</h3>
            <p className="text-sm">Selected: <strong>{counts.total}</strong>/11</p>
            <p className="text-sm">Credits left: <strong>{creditsLeft}</strong>/100</p>
            <div className="mt-2 text-sm">
              <div>Batsmen: {counts.roles.BAT}</div>
              <div>Wk: {counts.roles.WK}</div>
              <div>AllRounder: {counts.roles.AR}</div>
              <div>Bowlers: {counts.roles.BOWL}</div>
            </div>

            <div className="mt-4">
              <button
                disabled={!roleValid()}
                onClick={() => {
                  if (counts.total !== MAX_PLAYERS) return alert('Select 11 players before picking captain & vice-captain.');
                  setPage({ page: "PICK_CAPTAIN", data: { players: selectedPlayers, match: selectedMatch } });
                }}
                className={`w-full px-3 py-2 rounded ${roleValid() ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                Pick Captain & Vice
              </button>

              <button
                onClick={() => {
                  if (counts.total !== MAX_PLAYERS) return alert('Select 11 players before saving a team.');
                  const teamObj = {
                    id: `team_${Date.now()}`,
                    players: selectedPlayers,
                    matchId: selectedMatch?.id,
                    createdAt: new Date().toISOString(),
                    creditsLeft,
                    captain: null,
                    viceCaptain: null
                  };
                  if (typeof onSaveTeam === 'function') onSaveTeam(teamObj);
                  alert('Team saved! You can edit captain later from My Teams');
                  setSelectedPlayers([]);
                }}
                className="mt-3 w-full px-3 py-2 border rounded text-sm"
              >
                Save Team (without captain)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
