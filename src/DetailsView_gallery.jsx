import { useParams } from 'react-router-dom';
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './DetailsView_gallery.css';
import PropTypes from 'prop-types';
import { base } from './utils';

function DetailsViewGallery(props) {
  const {displayData, selectedDate} = props
  const { id } = useParams();
  console.log("cur DetailView's id");
  console.log(id);
  const [index, setIndex] = useState(0);
  const [gameStats, setGameStats] = useState([]);
  const [curData, setCurData] = useState(); //  which item data in displayData?
  const [gameId, setGameId] = useState(parseInt(id));
  console.log("I  directly set id to gameId");
  console.log(gameId);




  
  // debug for gameId
  useEffect(() => {
    console.log("Updated gameId: ", gameId);
  }, [gameId]);
  
  // Warning: change of gameId =>cchangee of index
  // get the sorted list of player based on the gameId and dates
  // const fetchData = async () => {
  //   try {
  //     console.log("inside fetch data");
  //     const response = await axios.get(`https://www.balldontlie.io/api/v1/stats?dates=${selectedDate}&game_ids[]=${gameId}&per_page=30`);
  //     console.log("response: ");
  //     console.log(response)
  //     const sortedStats = response.data.data.sort((a, b) => b.pts - a.pts);
  //     // console.log("sorted data");
  //     // console.log(sortedStats);
  //     setGameStats(sortedStats);
  //   } catch (error) {
  //     console.error("Error fetching game stats data:", error);
  //   }
  // };

  

  useEffect(()=>{
    console.log("after click the item, index is :" + index);
    
    const curIndex = displayData.findIndex(dd => {
        // console.log("dd.id" );
        // console.log(dd.id);
        // console.log("parseInt(id)" );
        // console.log(id);

        return dd.id === gameId;
    })
    // console.log("found the cur item index :" + curIndex);
    setIndex(curIndex);
    
    const fetchData = async () => {
      try {
        console.log("inside fetch data");
        const response = await axios.get(`https://www.balldontlie.io/api/v1/stats?dates=${selectedDate}&game_ids[]=${gameId}&per_page=30`);
        console.log("response: ");
        console.log(response)
        const sortedStats = response.data.data.sort((a, b) => b.pts - a.pts);
        // console.log("sorted data");
        // console.log(sortedStats);
        setGameStats(sortedStats);
      } catch (error) {
        console.error("Error fetching game stats data:", error);
      }
    };
    fetchData();


  },[gameId,displayData, index, selectedDate]); // add iindex, displayData, selectedDate

  


  // get the current data for conveninece
  useEffect(()=>{
    setCurData(displayData[index]);
  },[index,displayData]) // add displayData

  // next DetailsView
  const handlePrev = () => {
    console.log("PREV");
    let tempIndex = index;
    if (index > 0) {
        tempIndex = index - 1    
    }else{
        tempIndex = displayData.length - 1; 
    }
    setGameId(displayData[tempIndex].id);
};
  // last DetailsView
const handleNext = () => {

  let tempIndex = index
  if (index < displayData.length - 1) {
      tempIndex = index + 1;     
  }else{
      tempIndex = 0;
  }
  setGameId(displayData[tempIndex].id);
};



  // debug
  useEffect(() => {
    // console.log("Start!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    // console.log("index of current item")
    // console.log(index);
    // console.log("stats of the game")
    // console.log(gameStats);
    // console.log("displayData");
    // console.log(displayData);
    // console.log("END!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")

    
    
  },[gameStats]);
  // useEffect(() => {
  //   console.log("index of current item")
  //   console.log(index);
  //   console.log("stats of the game")
  //   console.log(gameStats);
  //   console.log("displayData");
  //   console.log(displayData);

    
    
  // },[index,gameStats]);
  
  return (
    
      

     
      <div className='whole'>
        <Link to="/GalleryView">
        <button className="closeButton" >Return</button>
        </Link>

     
        <button className="navButton leftButton_gallery" onClick={handlePrev} >
          <img src={`${base}/resource/left_arrow.png`} alt = 'left_arrow'></img>
        </button>

        <button className="navButton rightButton_gallery" onClick={handleNext} >
          <img src={`${base}/resource/right_arrow.png`} alt = 'right_arrow'></img>
        </button>


        
          <div className='Team_board'>
              <div className='logo_name'>
                  <img src={`${base}/resource/${displayData[index].home_team.id}.png`} alt={displayData[index].home_team.abbreviation} />
                  <span>{displayData[index].home_team.name}</span>
              </div>

              <span className="score">{(displayData[index].home_team_score === 0)?'-':displayData[index].home_team_score}</span>
              <span>-</span>
              <span className="score">{(displayData[index].visitor_team_score === 0)?'-':displayData[index].visitor_team_score}</span>

              <div className='logo_name'>
                  <img src={`${base}/resource/${displayData[index].visitor_team.id}.png`} alt={displayData[index].visitor_team.abbreviation} />
                  <span>{displayData[index].visitor_team.name}</span>
              </div>
          </div>
          

          {/* <div className='players_info'>
            <div className='players_info_left'>
              <span>23 lebron James F</span>
            </div>

          </div> */}
          <div className='players_info'>
            <div className='leftTable'>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th></th>
                    <th>Min</th>
                    <th>Reb</th>
                    <th>Ast</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
                  {gameStats.filter(player => {
                    return player.team.id === curData.home_team.id
                  })
                  .map(player => (
                    <tr key={player.player.id}>
                      <td>{player.player.first_name} {player.player.last_name} <span> · </span> {player.player.position}</td>
                      <td></td>
                      <td>{player.min || 0}</td>
                      <td>{player.reb || 0}</td>
                      <td>{player.ast || 0}</td>
                      <td>{player.pts || 0} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          
          
          {/* right table */}
         
            <div className='rightTable'>
              <table>
                <thead>
                  <tr>
                    
                    <th>Pts</th>
                    <th>Ast</th>
                    <th>Reb</th>
                    <th>Min</th>
                    <th></th>
                    <th>Name</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {gameStats.filter(player => {
                    return player.team.id === curData.visitor_team.id
                  })
                  .map(player => (
                    <tr key={player.player.id}>
                        <td>{player.pts || 0}</td>
                        <td>{player.ast || 0}</td>
                        <td>{player.reb || 0}</td>
                        <td>{player.min || 0}</td>
                        <td></td>
                        <td>  {player.player.position} <span> · </span> {player.player.first_name} {player.player.last_name} </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        </div>           
        

        
      </div>
   
    
  );
}



DetailsViewGallery.propTypes = {
  displayData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      home_team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        abbreviation: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired,
      home_team_score: PropTypes.number.isRequired,
      visitor_team: PropTypes.shape({
        id: PropTypes.number.isRequired,
        abbreviation: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
      }).isRequired,
      visitor_team_score: PropTypes.number.isRequired
    })
  ).isRequired,
  selectedDate: PropTypes.string.isRequired // Change to PropTypes.date if it's a Date object
};



export default DetailsViewGallery;