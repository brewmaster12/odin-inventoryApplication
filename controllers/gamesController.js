const db = require("../db/queries")

const gamesListGet = async (req, res) => {
    const games = await db.getAllGames();
    res.render("games/index", { title: "All games", games });
};

module.exports = {
    gamesListGet,
}