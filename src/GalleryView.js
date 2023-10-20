import React, {  useEffect } from 'react';
import axios from 'axios';
import GalleryItem from './GalleryItem';
import './GalleryView.css'
import PropTypes from 'prop-types';

function GalleryView(props) {
    const {
      selectedDate, setSelectedDate,
      displayData, setDisplayData, teams, selectedTeam, setSelectedTeam
    } = props;

    // useEffect(() => {
    //     // Fetch all teams when component mounts (only once)
    //     fetchTeams();
    // }, []);

    useEffect(() => {
        const fetchGamesOnDate = async () => {
            try {
                let apiUrl = `https://www.balldontlie.io/api/v1/games?start_date=${selectedDate}&end_date=${selectedDate}&dates[]=${selectedDate}`;
                
                const response = await axios.get(apiUrl);
                // console.log("response:")
                // console.log(response)
               
                setDisplayData(response.data.data)
    
            } catch (error) {
                console.error("Error fetching games data:", error);
            }
        };
        
      fetchGamesOnDate();

      
    //   filterByTeam();
      
      
        
    }, [selectedDate,setDisplayData]); // Note!!

    // const fetchTeams = async () => {
    //     try {
    //         const response = await axios.get(`https://www.balldontlie.io/api/v1/teams`);
    //         setTeams(response.data.data);
    //     } catch (error) {
    //         console.error("Error fetching teams data:", error);
    //     }
    // };

    // const fetchGamesOnDate = async () => {
    //     try {
    //         let apiUrl = `https://www.balldontlie.io/api/v1/games?start_date=${selectedDate}&end_date=${selectedDate}&dates[]=${selectedDate}`;
            
    //         const response = await axios.get(apiUrl);
    //         // console.log("response:")
    //         // console.log(response)
    //         setGamesData(response.data.data);
    //         setDisplayData(response.data.data)

    //     } catch (error) {
    //         console.error("Error fetching games data:", error);
    //     }
    // };

    // filter by teams
    // function filterByTeam(){
    //     const filtered = gamesData.filter(gd => {
    //         if(selectedTeam === "")return true;
    //         return gd.home_team.id === selectedTeam || gd.visitor_team.id === selectedTeam 
    //       })
          
    //       setDisplayData(filtered);
    
    // }
   

    

    // change everytime I select a team to filter
    // useEffect(() => {  
    //     filterByTeam();
        
    // }, [selectedTeam,gamesData]); // Note!!

    

    // for debug
//     useEffect(() => {
//       console.log("gameData")
//       console.log(gamesData)
//       console.log("selectedteam")
//       console.log(selectedTeam)
//       console.log("displayed data")
//       console.log(displayData)
//       console.log("teams")
//       console.log(teams)
//   }, [gamesData,displayData]);

return (
    <div className='gallery_container'>
        
        <div className="controls-container">
            <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
            />

            <select value={selectedTeam} onChange={(e) => setSelectedTeam(e.target.value)}>
                <option value="">ALL TEAMS</option>
                {teams.map((team) => (
                    <option key={team.id} value={team.id}>{team.full_name}</option>
                ))}
            </select>
        </div>

        {/* Conditional rendering */}
        {displayData.length === 0 ? (
            <p className='NoSchedule_words'>No schedule today. Try a Different Date</p>
        ) : (
            <div className="gallery-item-container">
                {displayData.map((game, index) => (
                    <GalleryItem key={game.id} game={game} index={index} />
                ))}
            </div>
        )}
        
    </div>
);

}




GalleryView.propTypes = {
    selectedDate: PropTypes.string.isRequired,
    setSelectedDate: PropTypes.func.isRequired,
    gamesData: PropTypes.arrayOf(PropTypes.object).isRequired,
    setGamesData: PropTypes.func.isRequired,
    displayData: PropTypes.arrayOf(PropTypes.object).isRequired,
    setDisplayData: PropTypes.func.isRequired,
    teams: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            full_name: PropTypes.string.isRequired
        })
    ).isRequired,
    setTeams: PropTypes.func.isRequired,
    selectedTeam: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    setSelectedTeam: PropTypes.func.isRequired,
};

export default GalleryView