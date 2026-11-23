// routes/genresRouter.js
const { Router } = require("express")
const genresRouter = Router()
const genresController = require("../controllers/genresController")

genresRouter.get("/", genresController.genresListGet);
genresRouter.get("/new", genresController.genreCreateGet);
genresRouter.post("/new", genresController.genreCreatePost);
genresRouter.get("/:genreId/edit", genresController.genreUpdateGet);
genresRouter.post("/:genreId/edit", genresController.genreUpdatePost);
genresRouter.get("/:genreId", genresController.getGenreById);

module.exports = genresRouter;