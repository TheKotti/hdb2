const router = require("express").Router();
const { Game } = require("../../db/gameDb.js");

router.get("/", async (req, res) => {
  try {
    //Get search param from url, get matching game
    //Undefined to get all games
    const id = req.query.id ? req.query.id : "%";
    const games = await Game.getGames(id);
    res.json(games);
  } catch (err) {
    throw err;
  }
});

exports.router = router;
