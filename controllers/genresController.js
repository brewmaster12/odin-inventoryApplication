// controllers/genresController.js
const db = require("../db/queries")

const genresListGet = async (req, res) => {
    const genres = await db.getAllgenres();
    res.render("genres/index", { title: "All genres", genres });
};

const getGenreById = async (req, res) => {
    const { genreId } = req.params;

    const genre = await db.getGenreById(Number(genreId));
    const games = await db.getGamesByGenreId(Number(genreId));

    res.render("genres/genre", { title: `Genre: ${genre.name}`, genre, games })
}

module.exports = {
    genresListGet,
    getGenreById
}