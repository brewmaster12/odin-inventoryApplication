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

async function getAllGenres() {
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

async function getAllDevs() {
    const { rows } = await pool.query(`
        SELECT * FROM developers ORDER BY name
    `);
    return rows;
}

async function getDevById(id) {
    const { rows } = await pool.query(
        "SELECT id, name FROM developers WHERE id = $1",
        [id]
    );
    return rows[0];
}

async function getGamesByDevId(devId) {
    const { rows } = await pool.query(`
        SELECT *
        FROM games
        WHERE games.developer_id = $1
    `, [devId]);
    return rows;
}

async function insertGenre(name) {
    await pool.query(
        "INSERT INTO genres (name) VALUES ($1)",
        [name]
    )
}

async function updateGenre(id, name) {
    await pool.query(
        "UPDATE genres SET name = $1 WHERE id = $2",
        [name, id]
    )
}

async function insertDev(name) {
    await pool.query(
        "INSERT INTO developers (name) VALUES ($1)",
        [name]
    )
}

async function updateDev(id, name) {
    await pool.query(
        "UPDATE developers SET name = $1 WHERE id = $2",
        [name, id]
    )
}

async function getGenreIdsByGameId(gameId) {
    const { rows } = await pool.query(
        "SELECT genre_id FROM games_genres WHERE game_id = $1",
        [gameId]
    );
    return rows.map((row) => row.genre_id);
}

async function insertGame({ title, releaseYear, developerId, genreIds}) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `INSERT INTO games (title, release_year, developer_id)
            VALUES ($1, $2, $3) RETURNING id`,
            [title, releaseYear, developerId]
        );
        const gameId = rows[0].id;
        for (const genreId of genreIds) {
            await client.query(
                "INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2)",
                [gameId, genreId]
            );
        }
        await client.query("COMMIT");
        return gameId;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

async function updateGame(id, { title, releaseYear, developerId, genreIds }) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(
            `UPDATE games SET title = $1, reelase_year = $2, developer_id = $3
            WHERE id = $4`,
            [title, releaseYear, developerId, id]
        );
        await client.query("DELETE FROM games_genres WHERE game_id = $1", [id]);
        for (const genreId of genreIds) {
            await client.query(
                "INSERT INTO games_genres (game_id, genre_id) VALUES ($1, $2",
                [id, genreId]
            );
        }
        await client.query("COMMIT");
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
}

module.exports = {
    getAllGames,
    getGameById,
    getAllGenres,
    getGenreById,
    getGamesByGenreId,
    getAllDevs,
    getDevById,
    getGamesByDevId,
    insertGenre,
    updateGenre,
    insertDev,
    updateDev,
    getGenreIdsByGameId,
    insertGame,
    updateGame
}