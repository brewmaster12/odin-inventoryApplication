// routes/developersRouter.js
const { Router } = require("express")
const developersRouter = Router()
const developersController = require("../controllers/developersController")

developersRouter.get("/", developersController.devsListGet);
developersRouter.get("/new", developersController.devCreateGet);
developersRouter.post("/new", developersController.devCreatePost);
developersRouter.get("/:devId/edit", developersController.devUpdateGet);
developersRouter.post("/:devId/edit", developersController.devUpdatePost);
developersRouter.post("/:devId/delete", developersController.devDeletePost);
developersRouter.get("/:devId", developersController.getDevById);

module.exports = developersRouter;