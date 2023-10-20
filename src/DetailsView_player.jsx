// DetailsView_player.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './DetailsView_player.css'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function DetailsView_player(props) {
    const { id } = useParams(); // Get the id from the URL
    const {season, playersData} = props; // players of searchList
    const [playerGameData, setPlayerData] = useState([]);
    const [playerId, setPlayerId] = useState(parseInt(id));
    const [searchListIndex,setSearchListIndex] = useState(0)
    // console.log("see see playerId: "+ playerId);
    // console.log("playersData (players of searchList): ");
    // console.log(playersData)




    useEffect(() => {
        async function fetch_SeasonPlayerData() {
            try {
                const response = await axios.get(`https://www.balldontlie.io/api/v1/stats?player_ids[]=${playerId}&seasons[]=${season}&per_page=20`);
                console.log("response from fetch_SeasonPlayerData");
                console.log(response)

                const sortedD = sortByScore(response.data.data);
                setPlayerData(sortedD);
            } catch (error) {
                console.error("Error fetch_SeasonPlayerData:", error);
            }
        }

        function findSearchListIndex(){
            const tempIndex = playersData.findIndex(dd => {
                return dd.id === playerId;
            });
            setSearchListIndex(tempIndex);
        }
        findSearchListIndex();
        fetch_SeasonPlayerData();
    }, [playerId]);

    // sort the playerData by the score 
    
   
    function sortByScore(data){
        const sortedData = data.sort((a,b) =>{
            return b.pts - a.pts;
        })
        return sortedData;
    }
     
// next DetailsView
const handlePrev = () => {
    console.log("PREV");
    let tempIndex = searchListIndex;
    if (searchListIndex > 0) {
        tempIndex = searchListIndex - 1    
    }else{
        tempIndex = playersData.length - 1; 
    }
    setPlayerId(playersData[tempIndex].id);
};
  // last DetailsView
const handleNext = () => {

  let tempIndex = searchListIndex;
  if (searchListIndex < playersData.length - 1) {
      tempIndex = searchListIndex + 1;     
  }else{
      tempIndex = 0;
  }
  setPlayerId(playersData[tempIndex].id);
};

    // transfer date to human readable form
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleString('en-US', options);
    }
    
    

    // debug
    useEffect(() => {
        console.log("PlayerGameData in the given season");
        console.log(playerGameData);
    },[playerGameData])
    useEffect(() => {
        console.log("searchListIndex of the player");
        console.log(searchListIndex);
    },[searchListIndex])

    return (
        <div className='Whole'>
            <Link to="/">
            <button className="closeButton" >Return</button>
            </Link>

            <div className="navigation-buttons">
                <button onClick={handlePrev} className='navButton leftButton'>
                    <img src='/resource/left_arrow.png'></img>
                    </button>
                <button onClick={handleNext} className='navButton rightButton'>
                    <img src='/resource/right_arrow.png'></img>
                </button>
            </div>

            <div className='playerAbout'>
                <img src={`/resource/${playerGameData[0]?.team?.id}.png`} alt={playerGameData[0]?.team?.name} />
                <div>
                    <span>{playerGameData[0]?.team?.full_name}</span>
                    <div className='playerName'>
                    <h1>{playerGameData[0]?.player?.first_name|| "Not playing"}</h1>
                    <h1>{playerGameData[0]?.player?.last_name}</h1>
                    </div>

                </div>
                <div className='seasonAverage'>
                    <div className='seasonData'>
                        <span>PPG</span>
                        <span>{playersData[searchListIndex]?.averages?.pts}</span>
                    </div>
                    <div className='seasonData'>
                        <span>RPG</span>
                        <span>{playersData[searchListIndex]?.averages?.reb}</span>
                    </div>
                    <div className='seasonData'>
                        <span>APG</span>
                        <span>{playersData[searchListIndex]?.averages?.ast}</span>
                    </div>
                    <div className='seasonData'>
                        <span>STL</span>
                        <span>{playersData[searchListIndex]?.averages?.stl}</span>
                    </div>
                    <div className='seasonData'>
                        <span>MIN</span>
                        <span>{playersData[searchListIndex]?.averages?.min}</span>
                    </div>
                    <div className='seasonData'>
                        <span>FG%</span>
                        <span>{playersData[searchListIndex]?.averages?.fg_pct}</span>
                    </div>
                    <div className='seasonData'>
                        <span>FG3%</span>
                        <span>{playersData[searchListIndex]?.averages?.fg3_pct}</span>
                    </div>
                </div>
            </div>

            <div className='SeasonGames'>
            <table>
                <thead>
                  <tr>
                    
                    <th>Pts</th>
                    <th>Reb</th>
                    <th>Ast</th>
                    <th>STL</th>
                    <th>Min</th>
                    <th>FG%</th>
                    <th>FG3%</th>
                    <th></th>
                    <th>TEAM</th>
                    <th>DATE</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {playerGameData
                  .map(curGame => (
                    <tr key={curGame.id}>
                        <td>{curGame.pts || 0}</td>
                        <td>{curGame.reb || 0}</td>
                        <td>{curGame.ast || 0}</td>
                        <td>{curGame.stl || 0}</td>
                        <td>{curGame.min || 0}</td>
                        <td>{curGame.fg_pct || 0}</td>
                        <td>{curGame.fg3_pct || 0}</td>
                        <td></td>
                        <td><img src={`/resource/${curGame.team.id === curGame.game.home_team_id ? curGame.game.visitor_team_id : curGame.game.home_team_id}.png`} alt={curGame?.team?.name} /></td>
                        <td>{curGame.game.date ? formatDate(curGame.game.date) : 0}</td>

                    </tr>
                  ))}
                </tbody>
              </table>
                

            </div>
            
            

            {/* <div>
                <button onClick={handlePrevious}>Previous</button>
                <button onClick={handleNext}>Next</button>
            </div> */}
            
        </div>
    );
}


DetailsView_player.propTypes = {
    season: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    playersData: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            averages: PropTypes.shape({
                pts: PropTypes.number,
                reb: PropTypes.number,
                ast: PropTypes.number,
                stl: PropTypes.number,
                min: PropTypes.number,
                fg_pct: PropTypes.number,
                fg3_pct: PropTypes.number,
            })
        })
    ).isRequired
};

export default DetailsView_player;

