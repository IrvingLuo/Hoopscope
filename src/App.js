import logo from './logo.svg';
import './App.css';
import{
  BrowserRouter as Router,
  Route,
  Routes,
  Link, Outlet } from "react-router-dom"
import React, { useState, useEffect } from 'react';

import GalleryView from './GalleryView';
import SearchView from './SearchView';
import DetailsView_gallery from './DetailsView_gallery';
import NotFound from './NotFound';
import axios from 'axios';
import DetailsView_player from './DetailsView_player';
import PropTypes from 'prop-types';




function App() {
  // Search state for SearchView
  const [query, setQuery] = useState("");
  const [playersData, setPlayersData] = useState([]); // player + average filter by season
  const [queryPlayers, setQueryPlayers] = useState([]) // player from the query
  const [season, setSeason] = useState("2022"); // Default season 2022
  const [sortType, setSortType] = useState('ppg'); // Default to 'ppg'. Can also be 'team'.
  const [isAscending, setIsAscending] = useState(false); // Default to true. Can also be false for descending.
  const [selectedTeam_search, setSelectedTeam_search] = useState("");


  // Gallery state
  const today = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [gamesData, setGamesData] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [teams, setTeams] = useState([]); // To store all the teams for dropdown
  const [selectedTeam, setSelectedTeam] = useState("");

  useEffect(() => {
    // Fetch all teams when component mounts (only once)
    fetchTeams();
}, []);
  const fetchTeams = async () => {
    try {
        const response = await axios.get(`https://www.balldontlie.io/api/v1/teams`);
        setTeams(response.data.data);
    } catch (error) {
        console.error("Error fetching teams data:", error);
    }
  };

  return (
    <Router>
      <div className='App'>
        <nav className='nav'>
          <p>🏀</p>
          <ul>
              <li><Link to="/">Search</Link></li>
              <li><Link to="/GalleryView">Schedule</Link></li>
          </ul>
        </nav>

       
        <Routes>
        <Route path="/" element={<SearchView 
                query={query} 
                setQuery={setQuery}
                playersData={playersData} 
                setPlayersData={setPlayersData}
                queryPlayers={queryPlayers}
                setQueryPlayers={setQueryPlayers}
                season={season}
                setSeason={setSeason}
                sortType={sortType}
                setSortType={setSortType}
                isAscending={isAscending}
                setIsAscending={setIsAscending}
                selectedTeam_search = {selectedTeam_search}
                setSelectedTeam_search ={setSelectedTeam_search}
                teams = {teams}

            />} />
          <Route path="/DetailsView_player/:id" 
                  element={<DetailsView_player
                    season = {season}
                    playersData = {playersData}
                   />} />


          <Route path="/GalleryView" 
                  element={<GalleryView
                  selectedDate = {selectedDate}
                  setSelectedDate = {setSelectedDate}
                  gamesData = {gamesData}
                  setGamesData = {setGamesData}
                  displayData = {displayData}
                  setDisplayData = {setDisplayData}
                  teams = {teams}
                  setTeams = {setTeams}
                  selectedTeam = {selectedTeam}
                  setSelectedTeam = {setSelectedTeam}

                  />} />
          <Route path="/DetailsView_gallery/:id" 
                  element={<DetailsView_gallery
                  displayData = {displayData}
                  selectedDate = {selectedDate}
                  />} /> {/* Note the :id parameter */}
          <Route path="*" element={<NotFound />} />
        </Routes>


      </div>
    </Router>
  );
}
// PropTypes for SearchView
SearchView.propTypes = {
  query: PropTypes.string.isRequired,
  setQuery: PropTypes.func.isRequired,
  playersData: PropTypes.array.isRequired,
  setPlayersData: PropTypes.func.isRequired,
  queryPlayers: PropTypes.array.isRequired,
  setQueryPlayers: PropTypes.func.isRequired,
  season: PropTypes.string.isRequired,
  setSeason: PropTypes.func.isRequired,
  sortType: PropTypes.string.isRequired,
  setSortType: PropTypes.func.isRequired,
  isAscending: PropTypes.bool.isRequired,
  setIsAscending: PropTypes.func.isRequired,
  selectedTeam_search: PropTypes.string.isRequired,
  setSelectedTeam_search: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired
};

// PropTypes for DetailsView_player
DetailsView_player.propTypes = {
  season: PropTypes.string.isRequired,
  playersData: PropTypes.array.isRequired
};

// PropTypes for GalleryView
GalleryView.propTypes = {
  selectedDate: PropTypes.string.isRequired,
  setSelectedDate: PropTypes.func.isRequired,
  gamesData: PropTypes.array.isRequired,
  setGamesData: PropTypes.func.isRequired,
  displayData: PropTypes.array.isRequired,
  setDisplayData: PropTypes.func.isRequired,
  teams: PropTypes.array.isRequired,
  setTeams: PropTypes.func.isRequired,
  selectedTeam: PropTypes.string.isRequired,
  setSelectedTeam: PropTypes.func.isRequired
};

// PropTypes for DetailsView_gallery
DetailsView_gallery.propTypes = {
  displayData: PropTypes.array.isRequired,
  selectedDate: PropTypes.string.isRequired
};
export default App;
