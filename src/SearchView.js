import './SearchView.css';
import { players } from './player_data';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayerList } from './PlayerList';

export default function SearchView() {
    const [query, setQuery] = useState("");
    const [playersData, setPlayersData] = useState([]); // player + average filter by season
    const [queryPlayers, setQueryPlayers] = useState([]) // player from the query
    const [season, setSeason] = useState("2022"); // Default season 2022
    const [sortType, setSortType] = useState('ppg'); // Default to 'ppg'. Can also be 'team'.
    const [isAscending, setIsAscending] = useState(false); // Default to true. Can also be false for descending.

   
   

    console.log(query);
    function handleQuery(e){
      setQuery((pre_query)=>(e.target.value))
    }
    function handleSeasonChange(e) {
      setSeason(e.target.value);
  }
    useEffect(() => {
      const fetchPlayersData = async () => {
          try {
              // Fetch players based on user's query
              const playersRes = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${query}&page=0&per_page=100`);
              const players = playersRes.data.data;
              console.log("fectched players : " )
              console.log(players)
              // Fetch averages for the fetched players
              const playerIds = players.map(player => player.id);
              const playerIdsQueryString = playerIds.map(id => `player_ids[]=${id}`).join('&');
              console.log("playerIdsQueryString");
              console.log(playerIdsQueryString);
              const averagesRes = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&${playerIdsQueryString}`);  
              const averages = averagesRes.data.data;
              
              console.log("averages")
              console.log(averages)
              
              // Combine player data with their respective averages
              const processedPlayers = players.map(player=>{
                  const playersAverage = averages.find(average=>average.player_id === player.id);
                  console.log("playersAverage")
                  console.log(playersAverage)
                  if(playersAverage){
                    return {...player, averages: playersAverage, playInSelectedSeason: true };
                  }else{
                    return {...player, playInSelectedSeason: false};
                  }

              }).sort((a, b) => {
                // If a's height is undefined and b's height is not, return 1 (a comes after b)
                if (!a.averages && b.averages) return 1;
                // If b's height is undefined and a's height is not, return -1 (a comes before b)
                if (a.averages && !b.averages) return -1;
                // Otherwise, don't change the order
                return 0;
            }).sort((a, b) => {
              if (sortType === 'ppg') {
                return isAscending ? a.averages?.pts - b.averages?.pts : b.averages?.pts - a.averages?.pts;
              }
              if (sortType === 'team') {
                const teamA = a.team?.full_name || '';
                const teamB = b.team?.full_name || '';
                return isAscending ? teamA.localeCompare(teamB) : teamB.localeCompare(teamA);
              }
              return 0;
            });
             

              // add a boolean value to determine if the  player from players play in current  season
              
              setPlayersData(processedPlayers);
            

          } catch (error) {
              console.error("Error fetching player data:", error);
          }
      };

      if (query) {
          fetchPlayersData();
      }
  }, [query, season,sortType, isAscending]);

    // for debug
      useEffect(() => {
        console.log("Updated playersData:", playersData);
    }, [playersData]);
  
    
    return (
      <div className="search">
        <div>
          
          <input type="text" placeholder="search..." className="search_bar" onChange={handleQuery}/>
          <input 
                  type="number" 
                  placeholder="Enter Season Year (e.g. 2017)" 
                  className="season_input" 
                  value={season}
                  onChange={handleSeasonChange}
              />

          <select value={sortType} onChange={e => setSortType(e.target.value)} className="sort_dropdown">
            <option value="ppg">Points Per Game</option>
            <option value="team">Team</option>
          </select>

          <button onClick={() => setIsAscending(!isAscending)} className="sort_order_button">
            {isAscending ? '↑' : '↓'}
          </button>


        </div>
        
        <PlayerList data={playersData} season_data={season} />
      </div>
   
  
    );
  }