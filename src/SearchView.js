import './SearchView.css';
import { players } from './player_data';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { PlayerList } from './PlayerList';
import PropTypes from 'prop-types';


function SearchView({ 
  query, setQuery, playersData, setPlayersData, 
  queryPlayers, setQueryPlayers, season, setSeason, 
  sortType, setSortType, isAscending, setIsAscending,selectedTeam_search,setSelectedTeam_search, teams }) {
    // console.log("selectedTeam_search, TEAM!!");
    // console.log(selectedTeam_search);

   
    console.log(query);
    function handleQuery(e){
      setQuery(e.target.value)
    }
    function handleSeasonChange(e) {
      setSeason(e.target.value);
  }
    // fetch all players related to query
    // 
    const fetchQueriedSortedPlayers = async () => {
      try {

        
        const playersRes = await axios.get(`https://www.balldontlie.io/api/v1/players?search=${query}&page=0&per_page=40`);
        const players = playersRes.data.data;
        // Fetch averages for the fetched players
        const playerIds = players.map(player => player.id);
        const playerIdsQueryString = playerIds.map(id => `player_ids[]=${id}`).join('&');
        // console.log("playerIdsQueryString: ");
        // console.log(playerIdsQueryString);
        const averagesRes = await axios.get(`https://www.balldontlie.io/api/v1/season_averages?season=${season}&${playerIdsQueryString}`);  
        const averages = averagesRes.data.data;
       

        

        // Combine player data with their respective averages
        const processedPlayers = players.map(player=>{
          const playersAverage = averages.find(average=>average.player_id === player.id);
      
          if(playersAverage){
            return {...player, averages: playersAverage, playInSelectedSeason: true };
          }else{
            return {...player, playInSelectedSeason: false};
          }

      })
      // then do the sorting
        
        let sortedPlayers = sortByAveragesPresence(processedPlayers);
        if (sortType === 'ppg') {
          sortedPlayers = sortByPPG(sortedPlayers);
      } else if (sortType === 'height') {
          sortedPlayers = sortByHeight(sortedPlayers);
      }
      
     
        sortedPlayers = sortedByTeam(sortedPlayers);
        

        // try to find the team for the player in given season
        const sortedPlayerIds = sortedPlayers .map(player => player.id);
        const sortedPlayerIdsQueryString = sortedPlayerIds.map(id => `player_ids[]=${id}`).join('&');
        const statsRes = await axios.get(`https://www.balldontlie.io/api/v1/stats?seasons[]=${season}&per_page=80&${sortedPlayerIdsQueryString}`);  
        const stats_withTeam = statsRes.data.data;
        // console.log("stats_withTeam:  ");
        // console.log(stats_withTeam);

        const players_withTeams = sortedPlayers.map(player=>{
          const theMacthedGame = stats_withTeam.find(stat=>stat.player.id === player.id);

          if(theMacthedGame){
            return {...player, matchedGame:theMacthedGame };
          }else{
            return player;
          }
        })
        

        setPlayersData(players_withTeams);


        
        
      } catch (error) {
        console.error("Error fetching sortedPlayers:", error);
      }
    };
  
    useEffect(() => {
      if (query!=="") {
        fetchQueriedSortedPlayers()
      }else{
        setPlayersData([]);
      }
    }, [query,season,isAscending, sortType,selectedTeam_search]);

    

    // 1. Sort based on the presence of the 'averages' property.
      function sortByAveragesPresence(data) {
        return data.sort((a, b) => {
            // If a's averages is undefined and b's averages is not, return 1 (a comes after b)
            if (!a.averages && b.averages) return 1;
            // If b's averages is undefined and a's averages is not, return -1 (a comes before b)
            if (a.averages && !b.averages) return -1;
            // Otherwise, don't change the order
            return 0;
        });
      }
    // 2. Sort based on the 'ppg' (points per game).
    function sortByPPG(data) {
      return data.sort((a, b) => {
          return isAscending ? (a.averages?.pts || 0) - (b.averages?.pts || 0) : (b.averages?.pts || 0) - (a.averages?.pts || 0);
      });
    }
    // 3. Sort based on the height
    function sortByHeight(data) {
      return data.sort((a, b) => {
          if(a.height_feet === undefined || a.height_inches === undefined)return 1;
          if(b.height_feet === undefined || b.height_inches === undefined)return -1;


          // Convert height to total inches
          const heightA = (a.height_feet || 0) * 12 + (a.height_inches || 0);
          const heightB = (b.height_feet || 0) * 12 + (b.height_inches || 0);
  
          // If sorting in ascending order
          return isAscending ? heightA - heightB : heightB - heightA;
      });
  }
  
    //4. sortedd by teams
    function sortedByTeam(data){
      const temp = data.filter(d => {
       
        if(selectedTeam_search === "")return true;
        console.log("i am " + d.first_name +" " + d.last_name);
        console.log("d.id: ");
        console.log("selectedTeam_search");
        console.log(selectedTeam_search);
        return selectedTeam_search === d.matchedGame.team.id || 0;
        
      })
      console.log("temp");
      console.log(temp);
      return temp;
    }

    // for debug
      useEffect(() => {
        console.log("Updated playersData:", playersData);
    }, [playersData]);
  
    
    return (
      <div className="search">
        <div className='upWrapper'>
          <div className='searchBar_ascending'>
              <input type="text" placeholder="Search Your Players" className="search_bar" onChange={handleQuery}/>
              <button onClick={() => setIsAscending(!isAscending)} className="sort_order_button">
                {isAscending ? '↓' : '↑'}
              </button>
          </div>
          <div className='filterwrapper'>
        
            <span>Season:</span>
            <input 
                    type="number" 
                    placeholder="Enter Season Year (e.g. 2017)" 
                    className="season_input" 
                    value={season}
                    onChange={handleSeasonChange}
                />

            <select value={sortType} onChange={e => setSortType(e.target.value)} className="sort_dropdown">
              <option value="ppg">Points Per Game</option>
              <option value="height">Height</option>
            </select>
            {/* <select className= 'sort_teamOpt'value={selectedTeam_search} onChange={(e) => setSelectedTeam_search(e.target.value)}>
                  <option value="">All Teams</option>
                  {teams.map((team) => (
                      <option key={team.id} value={team.id}>{team.full_name}</option>
                  ))}
            </select> */}

            
          </div>

        </div>
        
        <PlayerList data={playersData} season_data={season} />
      </div>
   
  
    );
  }
  // Define PropTypes
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
  teams: PropTypes.array.isRequired,
};

export default SearchView