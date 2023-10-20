import React from 'react';
import './GalleryItem.css'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
function GalleryItem({ game,index }) {
    const { home_team, home_team_score, visitor_team, visitor_team_score } = game;

    function formatDate(dateString) {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1); // Add one day
    
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleString('en-US', options);
    }
    

    return (
        <Link to={`/DetailsView_gallery/${game.id}`}>
        <div className="game-item">
            <div className="team home-team">
                <span>H</span>
                <img src={`${base}/resource/${home_team.id}.png`} alt={home_team.abbreviation} />
                <span>{home_team.name}</span>
                <span className="score">{(home_team_score === 0)?'-':home_team_score}</span>
            </div>
            <div className='middle'>
            <span>{formatDate(game.date)}</span>
            <span className="vs-text">VS</span>
            </div>

            <div className="team visitor-team">
                <span>A</span>
                <img src={`${base}/resource/${visitor_team.id}.png`} alt={visitor_team.abbreviation} />
                <span>{visitor_team.name}</span>
                <span className="score">{(visitor_team_score === 0)?'-':visitor_team_score}</span>
                
            </div>
        </div>
        </Link>
    );
}


GalleryItem.propTypes = {
    game: PropTypes.shape({
        id: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
        home_team: PropTypes.shape({
            id: PropTypes.number.isRequired,
            abbreviation: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
        home_team_score: PropTypes.number.isRequired,
        visitor_team: PropTypes.shape({
            id: PropTypes.number.isRequired,
            abbreviation: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
        visitor_team_score: PropTypes.number.isRequired,
    }).isRequired,
    // Uncomment below if `index` is needed
    // index: PropTypes.number.isRequired,
};

export default GalleryItem;
