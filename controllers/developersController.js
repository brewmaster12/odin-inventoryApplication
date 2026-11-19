// controllers/developersController.js
const db = require("../db/queries")

const devsListGet = async (req, res) => {
    const devs = await db.getAllDevs();
    res.render("devs/index", { title: "All developers", devs });
};

const getDevById = async (req, res) => {
    const { devId } = req.params;

    const dev = await db.getDevById(Number(devId));
    const games = await db.getGamesByDevId(Number(devId));

    res.render("devs/dev", { title: `Developer: ${dev.name}`, dev, games })
}

module.exports = {
    devsListGet,
    getDevById
}