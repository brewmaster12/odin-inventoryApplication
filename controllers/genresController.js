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

const genreCreateGet = (req, res) => {
    res.render("genres/form", { title: "New genre", genre: {} })
}

const genreCreatePost = async (req, res) => {
    const name = (req.body.name || "").trim();
    
    await db.insertGenre(name);
    
    res.redirect("/genres");
}

const genreUpdateGet = async (req, res) => {
    const id = Number(req.params.genreId);
    const genre = await db.getGenreById(id);
    res.render("genres/form", { title: `Edit ${genre.name}`, genre })
}

const genreUpdatePost = async (req, res) => {
    const id = Number(req.params.genreId);
    const name = (req.body.name || "").trim();
    await db.updateGenre(id, name);
    res.redirect(`/genres/${id}`);
}

module.exports = {
    genresListGet,
    getGenreById,
    genreCreateGet,
    genreCreatePost,
    genreUpdateGet,
    genreUpdatePost
}