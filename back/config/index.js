const fs = require("fs");
const nconf = require("nconf");
const path = require("path");

// Config load order
// 1. `process.env`
// 3. `config.json`
// 4. `defaults`

nconf
  .env()
  .file(path.join(__dirname, "config.json"))
  .defaults({});

exports.nconf = nconf;
