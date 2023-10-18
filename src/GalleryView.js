import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GalleryItem from './GalleryItem';
import './GalleryView.css'

export default function GalleryView() {
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

    useEffect(() => {
        
      fetchGamesOnDate();
        
    }, [selectedDate]); // Note!!

    const fetchTeams = async () => {
        try {
            const response = await axios.get(`https://www.balldontlie.io/api/v1/teams`);
            setTeams(response.data.data);
        } catch (error) {
            console.error("Error fetching teams data:", error);
        }
    };

    const fetchGamesOnDate = async () => {
        try {
            let apiUrl = `https://www.balldontlie.io/api/v1/games?start_date=${selectedDate}&end_date=${selectedDate}`;
            
            const response = await axios.get(apiUrl);
            // console.log("response:")
            // console.log(response)
            setGamesData(response.data.data);
            setDisplayData(response.data.data)

        } catch (error) {
            console.error("Error fetching games data:", error);
        }
    };

    // change everytime I select a team to filter
    useEffect(() => {  
      const filtered = gamesData.filter(gd => {
        if(selectedTeam == "")return true;
        return gd.home_team.id == selectedTeam || gd.visitor_team.id == selectedTeam 
      })
      
      setDisplayData(filtered);

        
    }, [selectedTeam]); // Note!!
    

    // for debug
    useEffect(() => {
      console.log("gameData")
      console.log(gamesData)
      console.log("selectedteam")
      console.log(selectedTeam)
      console.log("displayed data")
      console.log(displayData)
      // console.log("teams")
      // console.log(teams)
  }, [gamesData,displayData]);

    return (
        <div className='gallery_container'>
            <div className="controls-container">
              <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
              />

              <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                  <option value="">All</option>
                  {teams.map((team) => (
                      <option key={team.id} value={team.id}>{team.full_name}</option>
                  ))}
              </select>
            </div>
            <div className="gallery-item-container">
              {displayData.map((game) => (
                  <GalleryItem key={game.id} game={game} />
              ))}
            </div>
     
        </div>
    );
}
