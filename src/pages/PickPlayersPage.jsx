// src/pages/PickPlayersPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { fetchPlayersForMatch } from '../lib/api';

const ROLE_LABELS = {
  BAT: 'Batsman',
  BOWL: 'Bowler',
  AR: 'All-Rounder',
  WK: 'Wicket-Keeper',
};

const DEFAULT_CREDITS = 100;
const MAX_PLAYERS = 11;

const randomCredit = () => {
  const credits = [8, 8.5, 9, 9.5];
  return credits[Math.floor(Math.random() * credits.length)];
};

const mapRole = (rawRole = '') => {
  const r = String(rawRole).toLowerCase();
  if (r.includes('wicket') || r.includes('keeper')) return 'WK';
  if (r.includes('batsman') || r.includes('bat')) return 'BAT';
  if (r.includes('bowler') || r.includes('bowl')) return 'BOWL';
  if (r.includes('all') || r.includes('all-round') || r.includes('allround')) return 'AR';
  return '';
};

const mapTeamShort = (p) => {
  const t = String(p.team_short_name || p.team_short || p.team_name || p.team || '').toUpperCase().trim();
  if (t.includes('MS')) return 'MS';
  if (t.includes('PS')) return 'PS';
  return t || 'OTHER';
};

function computeSummary(selectedPlayers) {
  const counts = {
    total: 0,
    teams: { MS: 0, PS: 0 },
    roles: { BAT: 0, BOWL: 0, AR: 0, WK: 0 },
    creditsUsed: 0,
  };

  selectedPlayers.forEach(p => {
    counts.total++;
    const team = mapTeamShort(p);
    if (counts.teams[team] !== undefined) counts.teams[team]++;

    const role = mapRole(p.role);
    if (role === 'BAT') counts.roles.BAT++;
    if (role === 'BOWL') counts.roles.BOWL++;
    if (role === 'AR') counts.roles.AR++;
    if (role === 'WK') counts.roles.WK++;

    const credit = Number(p.event_player_credit ?? p.credit ?? p.event_player_credits ?? 0);
    counts.creditsUsed += isNaN(credit) ? 0 : credit;
  });

  return counts;
}

export default function PickPlayersPage({ selectedMatch, onSaveTeam, setPage, prefillTeam }) {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({ search: '' });
  const [activeRoleTab, setActiveRoleTab] = useState('WK');
  const [selectedPlayers, setSelectedPlayers] = useState(prefillTeam?.players || []);

  useEffect(() => {
    if (!selectedMatch) return;

    setLoading(true);
    fetchPlayersForMatch(selectedMatch.id)
      .then(data => {
        const arr = Array.isArray(data) ? data : Object.keys(data || {}).map(k => ({ id: k, ...data[k] }));

        const normalized = arr.map(p => ({
          ...p,
          event_player_credit: p.event_player_credit ?? p.event_player_credits ?? p.event_player_credit_value ?? randomCredit(),
        }));

        setPlayers(normalized);
      })
      .catch(err => {
        console.error('Failed to fetch players:', err);
        setPlayers([]);
      })
      .finally(() => setLoading(false));
  }, [selectedMatch]);

  const summary = useMemo(() => computeSummary(selectedPlayers), [selectedPlayers]);
  const creditsLeft = useMemo(() => (DEFAULT_CREDITS - summary.creditsUsed), [summary]);

  const canSelectPlayer = (p) => {
    if (selectedPlayers.find(sp => String(sp.id) === String(p.id) || String(sp.player_id) === String(p.player_id))) return false;
    if (selectedPlayers.length >= MAX_PLAYERS) return false;

    const team = mapTeamShort(p);
    const teamCount = selectedPlayers.filter(sp => mapTeamShort(sp) === team).length;
    if (teamCount >= 7) return false;

    const pCredit = Number(p.event_player_credit ?? p.credit ?? 0);
    const used = selectedPlayers.reduce((s, x) => s + Number(x.event_player_credit ?? x.credit ?? 0), 0);
    if ((used + pCredit) > DEFAULT_CREDITS) return false;

    return true;
  };

  const toggleSelect = (p) => {
    const idKey = p.id ?? p.player_id;
    const found = selectedPlayers.find(sp => String(sp.id) === String(idKey) || String(sp.player_id) === String(idKey));

    if (found) {
      setSelectedPlayers(prev => prev.filter(sp => !(String(sp.id) === String(idKey) || String(sp.player_id) === String(idKey))));
      return;
    }
    if (!canSelectPlayer(p)) return;
    setSelectedPlayers(prev => [...prev, p]);
  };

  const filteredByRole = players.filter(p => {
    const roleKey = mapRole(p.role);
    if (roleKey !== activeRoleTab) return false;
    if (filters.search && !String(p.name || p.player_name || p.short_name || '').toLowerCase().includes(filters.search.toLowerCase())) return false;
    return true;
  });

  const selectedRoleCounts = summary.roles;

  const goToPickCaptain = () => {
    if (summary.total !== MAX_PLAYERS) return alert(`Select ${MAX_PLAYERS} players before picking captain & vice-captain.`);
    setPage({
      page: 'PICK_CAPTAIN',
      data: { players: selectedPlayers, match: selectedMatch }
    });
  };

  const handleSaveTeam = () => {
    if (summary.total !== MAX_PLAYERS) return alert(`Select ${MAX_PLAYERS} players before saving a team.`);
    const teamObj = {
      id: `team_${Date.now()}`,
      players: selectedPlayers,
      matchId: selectedMatch?.id,
      createdAt: new Date().toISOString(),
      creditsLeft,
      captain: null,
      viceCaptain: null,
    };
    if (typeof onSaveTeam === 'function') onSaveTeam(teamObj);
    setSelectedPlayers([]);
    setPage({ page: 'MY_TEAMS', data: null });
  };

  const matchTeamA = (selectedMatch?.t1_short_name || selectedMatch?.team_a_short || 'MS').toUpperCase();
  const matchTeamB = (selectedMatch?.t2_short_name || selectedMatch?.team_b_short || 'PS').toUpperCase();

  return (
    <div className="w-full max-w-6xl mx-auto pb-24">

      {/* TOP SUMMARY BAR */}
      <div className="bg-red-600 text-white px-4 py-2 rounded mb-4 shadow-md">
        <div className="grid grid-cols-4 text-xs md:text-sm font-semibold text-center border-b border-red-400 pb-1">
          <div>Selected</div>
          <div>{matchTeamB}</div>
          <div>{matchTeamA}</div>
          <div>Credits Left</div>
        </div>

        <div className="grid grid-cols-4 mt-1 text-lg md:text-xl font-bold text-center">
          <div>{summary.total}/{MAX_PLAYERS}</div>
          <div>{summary.teams.PS ?? 0}</div>
          <div>{summary.teams.MS ?? 0}</div>
          <div>{Math.max(0, creditsLeft).toFixed(1)}</div>
        </div>
      </div>

      {/* SEARCH + ROLE TABS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <div className="flex gap-2">
          {['WK', 'BAT', 'AR', 'BOWL'].map(roleKey => (
            <button
              key={roleKey}
              onClick={() => setActiveRoleTab(roleKey)}
              className={`px-3 py-1 rounded text-sm font-semibold flex items-center gap-2 ${
                activeRoleTab === roleKey ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              <span>{ROLE_LABELS[roleKey]}</span>
              <span className="text-xs font-medium">{selectedRoleCounts[roleKey] ?? 0}</span>
            </button>
          ))}
        </div>

        <input
          value={filters.search}
          onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
          placeholder="Search player"
          className="px-3 py-2 border rounded"
        />
      </div>

      {/* PLAYER LIST */}
      <div className="max-h-[62vh] overflow-y-auto space-y-2">
        {loading && <div className="p-6 text-center">Loading players...</div>}

        {!loading && filteredByRole.length === 0 && (
          <div className="p-6 text-center text-gray-500">No players found for this role</div>
        )}

        {!loading && filteredByRole.map(p => {
          const idKey = p.id ?? p.player_id;
          const isSelected = !!selectedPlayers.find(sp => String(sp.id) === String(idKey) || String(sp.player_id) === String(idKey));
          const disabled = !isSelected && !canSelectPlayer(p);

          const playerName = p.name || p.player_name || p.short_name || `Player ${idKey}`;
          const playerRoleStr = p.role || p.player_role || '';
          const playerTeam = mapTeamShort(p);
          const credit = Number(p.event_player_credit ?? p.event_player_credits ?? p.credit ?? 0).toFixed(1);

          return (
            <button
              key={idKey}
              onClick={() => toggleSelect(p)}
              disabled={disabled}
              className={`w-full text-left p-3 rounded-lg shadow-sm border flex items-center justify-between
                ${isSelected ? 'bg-red-50 border-red-400' : 'bg-white hover:shadow'}
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div>
                <div className="font-semibold">{playerName}</div>
                <div className="text-xs text-gray-500">{playerRoleStr} • {playerTeam}</div>
              </div>

              <div className="text-sm font-medium">{credit}</div>
            </button>
          );
        })}
      </div>

      {/* STICKY BOTTOM BAR (Always Visible on Mobile) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 z-50 flex flex-col gap-2 md:hidden">
        <button
          disabled={summary.total !== MAX_PLAYERS}
          onClick={goToPickCaptain}
          className={`w-full px-3 py-2 rounded font-semibold ${
            summary.total === MAX_PLAYERS ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Pick Captain & Vice Captain
        </button>

        <button
          onClick={handleSaveTeam}
          className="w-full px-3 py-2 border rounded text-sm font-semibold"
        >
          Save Team (Without Captain)
        </button>
      </div>

      {/* Desktop buttons (already visible, keep original) */}
      <div className="hidden md:block mt-6 bg-gray-50 rounded p-3 shadow-inner space-y-2">
        <button
          disabled={summary.total !== MAX_PLAYERS}
          onClick={goToPickCaptain}
          className={`w-full px-3 py-2 rounded font-semibold ${
            summary.total === MAX_PLAYERS ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Pick Captain & Vice Captain
        </button>

        <button
          onClick={handleSaveTeam}
          className="w-full px-3 py-2 border rounded text-sm font-semibold"
        >
          Save Team (Without Captain)
        </button>
      </div>
    </div>
  );
}
