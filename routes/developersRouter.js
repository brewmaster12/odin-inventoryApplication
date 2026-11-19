// routes/developersRouter.js
const { Router } = require("express")
const developersRouter = Router()
const developersController = require("../controllers/developersController")

developersRouter.get("/", developersController.devsListGet);
developersRouter.get("/:devId", developersController.getDevById);

module.exports = developersRouter;