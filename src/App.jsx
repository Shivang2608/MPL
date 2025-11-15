import React, { useState } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import PickPlayersPage from "./pages/PickPlayersPage";
import PickCaptainPage from "./pages/PickCaptainPage";
import MyTeamsPage from "./pages/MyTeamsPage";
import UpcomingMatchesPage from "./pages/UpcomingMatchesPage";

export default function App() {
  const [pageState, setPageState] = useState({ page: "MATCHES", data: null });
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [allUserTeams, setAllUserTeams] = useState([]);
  const [prefillTeam, setPrefillTeam] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Handlers for saving/deleting teams
  const handleSaveTeam = (teamObj) => {
    setAllUserTeams((prev) => [...prev, teamObj]);
  };

  const handleDeleteTeam = (teamId) => {
    setAllUserTeams((prev) => prev.filter((t) => t.id !== teamId));
  };

  const renderPage = () => {
    const page = pageState.page;
    const data = pageState.data;

    switch (page) {
      case "MATCHES":
        return (
          <UpcomingMatchesPage
            onSelectMatch={(match) => {
              setSelectedMatch(match);
              setPageState({ page: "MY_TEAMS", data: null });
            }}
          />
        );

      case "MY_TEAMS":
        return (
          <MyTeamsPage
            match={selectedMatch}
            teams={allUserTeams}
            onDelete={handleDeleteTeam}
            setPage={(p) => setPageState({ page: p, data: null })}
            setSelectedForEdit={(team) => {
              setPrefillTeam(team);
              setSelectedMatch(selectedMatch);
              setPageState({ page: "PICK_PLAYERS", data: null });
            }}
          />
        );

      case "PICK_PLAYERS":
        return (
          <PickPlayersPage
            selectedMatch={selectedMatch}
            onSaveTeam={handleSaveTeam}
            setPage={setPageState}
            prefillTeam={prefillTeam}
          />
        );

      case "PICK_CAPTAIN":
        const players = data?.players || prefillTeam?.players || allUserTeams[0]?.players || [];
        const match = data?.match || selectedMatch;

        if (!players.length) {
          return (
            <div className="p-6 text-center">
              <p>No players selected. Please pick players first.</p>
              <button
                onClick={() => setPageState({ page: "PICK_PLAYERS", data: null })}
                className="mt-4 px-3 py-2 border rounded"
              >
                Go back
              </button>
            </div>
          );
        }

        return (
          <PickCaptainPage
            selectedPlayers={players}
            selectedMatch={match}
            onSaveTeam={handleSaveTeam}
            setPage={setPageState}
            editingTeam={prefillTeam}
          />
        );

      default:
        return (
          <UpcomingMatchesPage
            onSelectMatch={(match) => {
              setSelectedMatch(match);
              setPageState({ page: "MY_TEAMS", data: null });
            }}
          />
        );
    }
  };

  return (
    <div className="flex">
      <Sidebar
        currentPage={pageState.page}
        setPage={setPageState}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className="flex-1 min-h-screen bg-gray-100 ml-0 md:ml-64">
        <TopBar toggleSidebar={toggleSidebar} />

        <div className="p-4">{renderPage()}</div>
      </div>
    </div>
  );
}
