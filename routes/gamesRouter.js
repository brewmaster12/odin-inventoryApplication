// routes/gamesRouter.js
const { Router } = require("express")
const gamesRouter = Router()
const gamesController = require("../controllers/gamesController")

gamesRouter.get("/", gamesController.gamesListGet);
gamesRouter.get("/new", gamesController.gameCreateGet);
gamesRouter.post("/new", gamesController.gameCreatePost);
gamesRouter.get("/:gameId/edit", gamesController.gameUpdateGet);
gamesRouter.post("/:gameId/edit", gamesController.gameUpdatePost);
gamesRouter.get("/:gameId", gamesController.getGameById);

module.exports = gamesRouter;