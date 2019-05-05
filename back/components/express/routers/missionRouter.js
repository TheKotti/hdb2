const router = require("express").Router();
const { Mission } = require("../../db/missionDb.js");

router.get("/", async (req, res) => {
  try {
    //Get search params from url, get matching missions
    //Undefined to get all missions
    const gameId = req.query.game ? req.query.game : "%";
    const title = req.query.title ? "%" + req.query.title + "%" : "%";
    const id = req.query.id ? req.query.id : "%";

    const missions = await Mission.getMissions([title, gameId, id]);
    res.json(missions);
  } catch (err) {
    throw err;
  }
});

exports.router = router;
