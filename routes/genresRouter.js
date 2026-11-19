// routes/genresRouter.js
const { Router } = require("express")
const genresRouter = Router()
const genresController = require("../controllers/genresController")

genresRouter.get("/", genresController.genresListGet);
genresRouter.get("/:genreId", genresController.getGenreById);

module.exports = genresRouter;