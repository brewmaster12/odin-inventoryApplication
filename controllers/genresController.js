// controllers/genresController.js
const { body, validationResult } = require("express-validator");
const db = require("../db/queries")

const validateGenre = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required.")
        .isLength({ max: 255 }).withMessage("Name must be 255 characters or fewer."),
]

const genresListGet = async (req, res) => {
    const genres = await db.getAllGenres();
    res.render("genres/index", { title: "All genres", genres });
};

const getGenreById = async (req, res) => {
    const { genreId } = req.params;

    const genre = await db.getGenreById(Number(genreId));
    const games = await db.getGamesByGenreId(Number(genreId));

    res.render("genres/genre", { title: `Genre: ${genre.name}`, genre, games })
}

const genreCreateGet = (req, res) => {
    res.render("genres/form", { title: "New genre", genre: {}, errors: [] })
}

const genreCreatePost = [
    validateGenre,
    async (req, res) => {
        const { name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("genres/form", {
                title: "New genre",
                genre: { name },
                errors: errors.array(),
            })
        }
        try {
            await db.insertGenre(name);
        } catch (err) {
            if (err.code === "23505") {
                return res.status(400).render("genres/form", {
                    title: "New genre",
                    genre: { name },
                    errors: [{ msg: "That genre already exists."}],
                });
            }
            throw err;
        }
        res.redirect("/genres");
    }
]

const genreUpdateGet = async (req, res) => {
    const id = Number(req.params.genreId);
    const genre = Number.isInteger(id) && (await db.getGenreById(id));
    if (!genre) return res.status(400).send("Genre not found");

    res.render("genres/form", { title: `Edit ${genre.name}`, genre, errors: [] })
}

const genreUpdatePost = [
    validateGenre,
    async (req, res) => {
        const id = Number(req.params.genreId);
        if (!Number.isInteger(id)) return res.status(404).send("Genre not found");

        const { name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("genres/form", {
                title: "Edit genre",
                genre: { id, name },
                errors: errors.array(),
            });
        }

        try {
            await db.updateGenre(id, name);
        } catch (err) {
            if (err.code === "23505") {
                return res.status(400).render("genres/form", {
                    title: "Edit genre",
                    genre: { id, name },
                    errors: [{ msg: "That genre already exists." }],
                });
            }
            throw err;
        }
        res.redirect(`/genres/${id}`);
    }
]

const genreDeletePost = async (req, res) => {
    const id = Number(req.params.genreId);
    if (!Number.isInteger(id)) return res.status(404).send("Genre not found");

    await db.deleteGenre(id);
    res.redirect("/genres");
}

module.exports = {
    genresListGet,
    getGenreById,
    genreCreateGet,
    genreCreatePost,
    genreUpdateGet,
    genreUpdatePost,
    genreDeletePost
}