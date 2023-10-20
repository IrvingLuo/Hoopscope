import React from "react";
import './PlayerList.css';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { base } from './utils';
export const PlayerList = ({data, season_data}) => {
    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>NAME</th>
                        <th>TEAM</th>
                        <th>PPG  ({season_data})</th>
                        <th>HEIGHT</th>               
                    </tr>
                </thead>
            </table>

            <div className="playerList">
                {data.map(player => (
                    <Link to={`/DetailsView_player/${player.id}`} key={player.id}>
                    <div className="playerRow" >
                        
                        <div className="playerName">
                            {player.first_name} {player.last_name}
                        </div>
                        <div className="playerTeam">
                            <img src={`${base}/resource/${(player?.matchedGame)?player?.matchedGame
?.team?.id : player.team.id}.png`} alt="player_team_givenseason"/>
                            <span>{(player?.matchedGame)?player?.matchedGame
?.team?.abbreviation : "N/A"}</span>
                            
                        </div>
                        <div className="playerPPG">
                            {player.averages ? player.averages.pts : "Not Playing"}
                        </div>
                        <div className="playerHeight">
                            {player.height_feet && player.height_inches
                                ? `${player.height_feet}-${player.height_inches}`
                                : "N/A"}
                        </div>
                    </div>
                    </Link>
                ))}
            </div>
        </>
    );
}



PlayerList.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            first_name: PropTypes.string.isRequired,
            last_name: PropTypes.string.isRequired,
            team: PropTypes.shape({
                id: PropTypes.number.isRequired
            }),
            averages: PropTypes.shape({
                pts: PropTypes.number
            }),
            height_feet: PropTypes.number,
            height_inches: PropTypes.number,
            matchedGame: PropTypes.shape({
                team: PropTypes.shape({
                    id: PropTypes.number.isRequired,
                    abbreviation: PropTypes.string.isRequired
                })
            })
        })
    ).isRequired,
    season_data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired
};
