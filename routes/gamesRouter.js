const { Router } = require("express")
const gamesRouter = Router()
const gamesController = require("../controllers/gamesController")
const db = require("../db/queries")

gamesRouter.get("/", gamesController.gamesListGet);

module.exports = gamesRouter;