const router = require("express").Router();
const { Escalation } = require("../../db/escalationDb.js");

router.get("/", async (req, res) => {
  try {
    //Get search params from url, get matching escalations
    //Undefined to get all escalations
    const id = req.query.id ? req.query.id : "%";
    const title = req.query.title ? "%" + req.query.title + "%" : "%";
    const map = req.query.map ? "%" + req.query.map + "%" : "%";

    const escalations = await Escalation.getEscalations([id, title, map]);
    res.json(escalations);
  } catch (err) {
    throw err;
  }
});

exports.router = router;
