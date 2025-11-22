// src/App.jsx
import React, { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";

import PickPlayersPage from "./pages/PickPlayersPage";
import PickCaptainPage from "./pages/PickCaptainPage";
import MyTeamsPage from "./pages/MyTeamsPage";
import UpcomingMatchesPage from "./pages/UpcomingMatchesPage";

// ✅ New NotAvailablePage component
const NotAvailablePage = ({ title, message }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-6">
    <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
    <p className="text-gray-600">{message}</p>
  </div>
);

export default function App() {
  // -------------------------------
  // 🔴 PAGE + DATA STATE
  // -------------------------------
  const [pageState, setPageState] = useState({
    page: "MATCHES",
    data: null,
  });

  const [selectedMatch, setSelectedMatch] = useState(null);

  // --------------------------------------------------
  // ✅ Restore last visited page on refresh
  // --------------------------------------------------
  useEffect(() => {
    const savedState = localStorage.getItem("pageState");
    const savedMatch = localStorage.getItem("selectedMatch");

    if (savedState) setPageState(JSON.parse(savedState));
    if (savedMatch) setSelectedMatch(JSON.parse(savedMatch));
  }, []);

  // --------------------------------------------------
  // ✅ Save page state on every page change
  // --------------------------------------------------
  const updatePage = (newPage) => {
    setPageState(newPage);
    localStorage.setItem("pageState", JSON.stringify(newPage));
  };

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

  // Save teams automatically
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
      localStorage.setItem("allUserTeams", JSON.stringify(updated));
      return updated;
    });
  };

  // -------------------------------
  // 🟢 Delete Team
  // -------------------------------
  const handleDeleteTeam = (teamId) => {
    setAllUserTeams((prev) => {
      const updated = prev.filter((t) => t.id !== teamId);
      localStorage.setItem("allUserTeams", JSON.stringify(updated));
      return updated;
    });
  };

  // ----------------------------------------------------------------
  // 🔥 THE MAIN PAGE RENDERING
  // ----------------------------------------------------------------
  const renderPage = () => {
    const page = pageState.page;
    const data = pageState.data;

    switch (page) {
      case "MATCHES":
        return (
          <UpcomingMatchesPage
            onSelectMatch={(match) => {
              setSelectedMatch(match);
              localStorage.setItem("selectedMatch", JSON.stringify(match));
              updatePage({ page: "MY_TEAMS", data: null });
            }}
          />
        );

      case "MY_TEAMS":
        return (
          <MyTeamsPage
            match={selectedMatch}
            myTeams={allUserTeams}
            setPage={updatePage}
            setSelectedForEdit={(team) => {
              setPrefillTeam(team);
              localStorage.setItem("selectedMatch", JSON.stringify(selectedMatch));
              updatePage({ page: "PICK_PLAYERS", data: null });
            }}
          />
        );

      case "PICK_PLAYERS":
        return (
          <PickPlayersPage
            selectedMatch={selectedMatch}
            onSaveTeam={handleSaveTeam}
            setPage={updatePage}
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
                  updatePage({ page: "PICK_PLAYERS", data: null })
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
            setPage={updatePage}
            editingTeam={prefillTeam}
          />
        );

      case "NOT_AVAILABLE":
        return <NotAvailablePage title={data?.title} message={data?.message} />;

      default:
        return (
          <UpcomingMatchesPage
            onSelectMatch={(match) => {
              setSelectedMatch(match);
              localStorage.setItem("selectedMatch", JSON.stringify(match));
              updatePage({ page: "MY_TEAMS", data: null });
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
        setPage={updatePage}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen bg-gray-100 relative mx-4">
        <TopBar toggleSidebar={toggleSidebar} />
        <div className="flex-1 overflow-y-auto no-scrollbar">{renderPage()}</div>
      </div>
    </div>
  );
}
