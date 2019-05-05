const router = require("express").Router();
const { Elusive } = require("../../db/elusiveDb.js");

router.get("/", async (req, res) => {
  try {
    //Get search params from url, get matching ETs
    //Undefined to get all ETs
    const id = req.query.id ? req.query.id : "%";
    const title = req.query.title ? "%" + req.query.title + "%" : "%";
    const map = req.query.map ? "%" + req.query.map + "%" : "%";

    const elusives = await Elusive.getElusives([id, title, map]);
    res.json(elusives);
  } catch (err) {
    throw err;
  }
});

exports.router = router;
