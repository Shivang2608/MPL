// src/lib/api.js
export const API = {
  matches:
    'https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_upcoming_Matches.json',
  players:
    'https://leaguex.s3.ap-south-1.amazonaws.com/task/fantasy-sports/Get_All_Players_of_match.json',
};

export async function fetchMatches() {
  const res = await fetch(API.matches);
  if (!res.ok) throw new Error('Failed to fetch matches');
  const data = await res.json();
  return data;
}

export async function fetchPlayersForMatch(matchId) {
  // The players file from the task is a single file that contains players per match.
  const res = await fetch(API.players);
  if (!res.ok) throw new Error('Failed to fetch players');
  const data = await res.json();
  // attempt to return players for matchId; fall back to array if structure differs
  if (data[matchId]) return data[matchId];
  // if it's an array, return it
  if (Array.isArray(data)) return data;
  // else try to flatten object
  return Object.values(data).flat();
}
