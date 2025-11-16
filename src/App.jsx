// src/App.jsx
import React, { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import PickPlayersPage from "./pages/PickPlayersPage";
import PickCaptainPage from "./pages/PickCaptainPage";
import MyTeamsPage from "./pages/MyTeamsPage";
import UpcomingMatchesPage from "./pages/UpcomingMatchesPage";

export default function App() {
  const [pageState, setPageState] = useState({ page: "MATCHES", data: null });
  const [selectedMatch, setSelectedMatch] = useState(null);

  // -------------------------------
  // 🟢 Load saved teams from localStorage
  // -------------------------------
  const [allUserTeams, setAllUserTeams] = useState([]);

  useEffect(() => {
    const savedTeams = localStorage.getItem("allUserTeams");
    if (savedTeams) {
      setAllUserTeams(JSON.parse(savedTeams));
    }
  }, []);

  // 🟢 Save teams to localStorage on every update
  useEffect(() => {
    localStorage.setItem("allUserTeams", JSON.stringify(allUserTeams));
  }, [allUserTeams]);

  const [prefillTeam, setPrefillTeam] = useState(null);

  // Sidebar state
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // -------------------------------
  // 🟢 Save Team
  // -------------------------------
  const handleSaveTeam = (teamObj) => {
    setAllUserTeams((prev) => {
      const updated = [...prev, teamObj];
      localStorage.setItem("allUserTeams", JSON.stringify(updated)); // Save to storage
      return updated;
    });
  };

  // -------------------------------
  // 🟢 Delete Team
  // -------------------------------
  const handleDeleteTeam = (teamId) => {
    setAllUserTeams((prev) => {
      const updated = prev.filter((t) => t.id !== teamId);
      localStorage.setItem("allUserTeams", JSON.stringify(updated)); // Save to storage
      return updated;
    });
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
            myTeams={allUserTeams}
            setPage={setPageState}
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
        const players =
          data?.players ||
          prefillTeam?.players ||
          allUserTeams[0]?.players ||
          [];

        const match = data?.match || selectedMatch;

        if (!players.length) {
          return (
            <div className="p-6 text-center">
              <p>No players selected. Please pick players first.</p>
              <button
                onClick={() =>
                  setPageState({ page: "PICK_PLAYERS", data: null })
                }
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
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        currentPage={pageState.page}
        setPage={setPageState}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-100 relative mx-4">
        {/* TopBar */}
        <TopBar toggleSidebar={toggleSidebar} />

        {/* Page Content */}
        <div className="flex-1 overflow-hidden">{renderPage()}</div>
      </div>
    </div>
  );
}
