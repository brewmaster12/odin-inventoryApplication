// controllers/gamesController.js
const db = require("../db/queries")

const gamesListGet = async (req, res) => {
    const games = await db.getAllGames();
    res.render("games/index", { title: "All games", games });
};

const getGameById = async (req, res) => {
    const { gameId } = req.params;

    const game = await db.getGameById(Number(gameId));

    res.render("games/game", { title: `Game: ${game.title}`, game })
}

module.exports = {
    gamesListGet,
    getGameById
}