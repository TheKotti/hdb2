const express = require("express");
const compression = require("compression");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");
const passport = require('passport');
require('../auth');
const { router: gameRouter } = require("./routers/gameRouter.js");
const { router: missionRouter } = require("./routers/missionRouter.js");
const { router: elusiveRouter } = require("./routers/elusiveRouter.js");
const { router: escalationRouter } = require("./routers/escalationRouter.js");
const { router: contractRouter } = require("./routers/contractRouter.js");
const { router: loginRouter } = require("./routers/loginRouter.js");
//const { router: notFoundRouter } = require("./routers/catch-all-redirect");

// App init
const app = express();
// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());

// Routes
app.use("/api/login", loginRouter);
app.use("/api/games", gameRouter);
app.use("/api/missions", missionRouter);
app.use("/api/elusives", elusiveRouter);
app.use("/api/escalations", escalationRouter);
app.use("/api/contracts", contractRouter);
//app.use("*", notFoundRouter);

exports.app = app;
