import React, { useState, useEffect } from 'react';

function PlayerAverages() {
    const [averages, setAverages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPlayers() {
            const response = await fetch('https://www.balldontlie.io/api/v1/players?per_page=100'); // Fetching maximum 100 for simplicity, handle pagination for more.
            const data = await response.json();
            return data.data.map(player => player.id);  // Extracting player IDs.
        }

        async function fetchAveragesForPlayer(playerIds) {
            const response = await fetch(`https://www.balldontlie.io/api/v1/season_averages?player_ids[]=${playerIds.join('&player_ids[]=')}`);
            const data = await response.json();
            setAverages(data.data);
            setLoading(false);
        }

        fetchPlayers().then(playerIds => {
            fetchAveragesForPlayer(playerIds);
        });
        console.log(averages);
    }, []);

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {averages.map(avg => (
                <div key={avg.player_id}>
                    Player ID: {avg.player_id}, Points: {avg.pts}
                </div>
            ))}
        </div>
    );
}

export default PlayerAverages;
