import React from "react";
import './PlayerList.css';
export const PlayerList = ({data, season_data}) => {
    return (
        <table>
            <tbody>
                <tr>
                    <th>PLAYER</th>
                    <th>TEAM(Recent)</th>
                    <th>PPG  ({season_data})</th>
                    <th>HEIGHT</th>               
                </tr>
                {data.map(player => (
                    <tr key = {player.id}>
                        <td>{player.first_name} {player.last_name}</td>
                        <td>{player.team.abbreviation}</td>
                        <td>{(player.averages) ? player.averages.pts:"Not Playing"
                            }
                        </td>
                        <td>{(player.height_feet&&player.height_inches)
                            ? `${player.height_feet}-${player.height_inches}`
                            : "N/A"}
                        </td>

                    </tr>
                ))}
            </tbody>
        </table>
        // <ul className="list">
        //     {data.map((player)=>(
        //     <li className="listItem" key={player.id}>
        //         <img></img>
        //         <div>
        //             <span>{player.first_name} {player.last_name}</span>
                    
        //         </div>
  
        //     </li>

        //     ))}
        
        
        // </ul>
    );
}