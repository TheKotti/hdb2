const router = require("express").Router();
const { Contract } = require("../../db/contractDb.js");

router.get("/", async (req, res) => {
  try {
    //Get search params from url, get matching contracts
    //Undefined to get all contracts
    const gameId = req.query.game ? req.query.game : "%";
    const title = req.query.title ? "%" + req.query.title + "%" : "%";
    const id = req.query.id ? req.query.id : "%";
    const map = req.query.map ? "%" + req.query.map + "%" : "%";
    const creator = req.query.creator ? "%" + req.query.creator + "%" : "%";
    const creatorId = req.query.creatorId ? req.query.creatorId : "%";
    let platform = "Contracts.ContractId";
    if (["pc", "x1", "ps4"].includes(req.query.platform)) {
      platform = "Contract" + req.query.platform.toUpperCase();
    }

    const contracts = await Contract.getContracts(
      [title, creator, map, gameId, id, creatorId],
      platform
    );
    res.json(contracts);
  } catch (err) {
    throw err;
  }
});

exports.router = router;
