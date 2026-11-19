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

async function getGameById(id) {
    const { rows } = await pool.query(`
        SELECT games.id, games.title, games.release_year, developers.name AS developer
        FROM games
        LEFT JOIN developers ON developers.id = games.developer_id
        WHERE games.id = $1
    `, [id]);
    return rows[0];
}

async function getAllgenres() {
    const { rows } = await pool.query(`
        SELECT * FROM genres ORDER BY name
    `);
    return rows;
}

async function getGenreById(id) {
    const { rows } = await pool.query(
        "SELECT id, name FROM genres WHERE id = $1",
        [id]
    );
    return rows[0];
}

async function getGamesByGenreId(genreId) {
    const { rows } = await pool.query(`
        SELECT games.id, games.title, games.release_year
        FROM games
        JOIN games_genres ON games_genres.game_id = games.id
        WHERE games_genres.genre_id = $1
        ORDER BY games.title
    `, [genreId]);
    return rows;
}

module.exports = {
    getAllGames,
    getGameById,
    getAllgenres,
    getGenreById,
    getGamesByGenreId
}