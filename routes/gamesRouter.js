// routes/gamesRouter.js
const { Router } = require("express")
const gamesRouter = Router()
const gamesController = require("../controllers/gamesController")

gamesRouter.get("/", gamesController.gamesListGet);
gamesRouter.get("/:gameId", gamesController.getGameById);

module.exports = gamesRouter;