// db/queries.js
const pool = require("./pool");

async function getAllGames() {
    const { rows } = await pool.query(`
        SELECT games.id, games.title, games.release_year, developers.name AS developer
        FROM games
        LEFT JOIN developers ON developers.id = games.developer_id
        ORDER BY games.title
    `);
    return rows;
}

module.exports = {
    getAllGames,
}