// controllers/developersController.js
const { body, validationResult } = require("express-validator");
const db = require("../db/queries");

const validateDev = [
    body("name")
        .trim()
        .notEmpty().withMessage("Name is required.")
        .isLength({ max: 255 }).withMessage("Name must be 255 characters or fewer."),
]

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

const devCreateGet = (req, res) => {
    res.render("devs/form", { title: "New developer", dev: {}, errors: [] })
}

const devCreatePost = [
    validateDev,
    async (req, res) => {
        const { name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("devs/form", {
                title: "New developer",
                dev: { name },
                errors: errors.array(),
            })
        }
        try {
            await db.insertDev(name);
        } catch (err) {
            if (err.code === "23505") {
                return res.status(400).render("devs/form", {
                    title: "New developer",
                    dev: { name },
                    errors: [{ msg: "That developer already exists."}],
                });
            }
            throw err;
        }
        res.redirect("/developers");
    }
]

const devUpdateGet = async (req, res) => {
    const id = Number(req.params.devId);
    const dev = Number.isInteger(id) && (await db.getDevById(id));
    if (!dev) return res.status(400).send("dev not found");

    res.render("devs/form", { title: `Edit ${dev.name}`, dev, errors: [] })
}

const devUpdatePost = [
    validateDev,
    async (req, res) => {
        const id = Number(req.params.devId);
        if (!Number.isInteger(id)) return res.status(404).send("Developer not found");

        const { name } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("devs/form", {
                title: "Edit dev",
                dev: { id, name },
                errors: errors.array(),
            });
        }

        try {
            await db.updateDev(id, name);
        } catch (err) {
            if (err.code === "23505") {
                return res.status(400).render("devs/form", {
                    title: "Edit developer",
                    dev: { id, name },
                    errors: [{ msg: "That developer already exists." }],
                });
            }
            throw err;
        }
        res.redirect(`/developers/${id}`);
    }
]

module.exports = {
    devsListGet,
    getDevById,
    devCreateGet,
    devCreatePost,
    devUpdateGet,
    devUpdatePost
}