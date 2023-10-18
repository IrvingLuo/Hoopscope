import React from 'react';
import { Link } from 'react-router-dom';
import './GalleryItem.css'
function GalleryItem({ game }) {
    const { home_team, home_team_score, visitor_team, visitor_team_score } = game;

    function formatDate(dateString) {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleString('en-US', options);
    }

    return (
    <Link to={`/DetailsView_gallery/${game.id}`}>
        <div className="game-item">
            <div className="team home-team">
                <img src={`./resource/${home_team.id}.png`} alt={home_team.abbreviation} />
                <span>{home_team.name}</span>
                <span className="score">{(visitor_team_score == 0)?'-':visitor_team_score}</span>
            </div>
            <div className='middle'>
            <span>{formatDate(game.date)}</span>
            <span className="vs-text">VS</span>
            </div>

            <div className="team visitor-team">
                <img src={`./resource/${visitor_team.id}.png`} alt={visitor_team.abbreviation} />
                <span>{visitor_team.name}</span>
                <span className="score">{(visitor_team_score == 0)?'-':visitor_team_score}</span>
                
            </div>
        </div>

    </Link>
    );
}

export default GalleryItem;
