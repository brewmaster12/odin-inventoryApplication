// controllers/gamesController.js
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const validateGame = [
    body("title")
        .trim()
        .notEmpty().withMessage("Title is required.")
        .isLength({ max: 255 }).withMessage("Title must be 255 characters or fewer."),
    body("release_year")
        .optional({ values: "falsy" })
        .isInt({ min: 1950, max: 2100 }).withMessage("Year must be between 1950 and 2100.")
        .toInt(),
    body("developer_id")
        .isInt().withMessage("Please choose a developer.")
        .toInt(),
    body("genre_ids").toArray(),
    body("genre_ids.*").isInt().toInt(),
];

const gamesListGet = async (req, res) => {
    const games = await db.getAllGames();
    res.render("games/index", { title: "All games", games });
};

const getGameById = async (req, res) => {
    const { gameId } = req.params;

    const game = await db.getGameById(Number(gameId));

    res.render("games/game", { title: `Game: ${game.title}`, game })
};

async function renderGameForm(res, { status = 200, title, game, selectedGenreIds, errors = [] }) {
    const [developers, genres] = await Promise.all([
        db.getAllDevs(),
        db.getAllGenres(),
    ]);
    res.status(status).render("games/form", {
        title, game, developers, genres, selectedGenreIds, errors,
    });
}

const gameCreateGet = async (req, res) => {
    await renderGameForm(res, {
        title: "New game",
        game: {},
        selectedGenreIds: [],
    });
};

const gameCreatePost = [
    validateGame,
    async (req, res) => {
        const { title, release_year, developer_id, genre_ids } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return renderGameForm(res, {
                status: 400,
                title: "New game",
                game: { title, release_year, developer_id },
                selectedGenreIds: genre_ids,
                errors: errors.array(),
            });
        }

        const gameId = await db.insertGame({
            title,
            releaseYear: release_year || null,
            developerId: developer_id,
            genreIds: genre_ids,
        });
        res.redirect(`/games/${gameId}`);
    },
];

const gameUpdateGet = async (req, res) => {
    const id = Number(req.params.gameId);
    const game = Number.isInteger(id) && (await db.getGameById(id));
    if (!game) return res.status(404).send("Game not found");

    const selectedGenreIds = await db.getGenreIdsByGameId(id);
    await renderGameForm(res, {
        title: `Edit ${game.title}`,
        game,
        selectedGenreIds,
    });
};

const gameUpdatePost = [
    validateGame,
    async (req, res) => {
        const id = Number(req.params.gameId);
        if (!Number.isInteger(id) || !(await db.getGameById(id))) {
            return res.status(404).send("Game not found");
        }

        const { title, release_year, developer_id, genre_ids } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return renderGameForm(res, {
                status: 400,
                title: "Edit game",
                game: { id, title, release_year, developer_id },
                selectedGenreIds: genre_ids,
                errors: errors.array(),
            });
        }

        await db.updateGame(id, {
            title,
            releaseYear: release_year || null,
            developerId: developer_id,
            genreIds: genre_ids,
        });
        res.redirect(`/games/${id}`);
    },
];

module.exports = {
    gamesListGet,
    getGameById,
    gameCreateGet,
    gameCreatePost,
    gameUpdateGet,
    gameUpdatePost
}