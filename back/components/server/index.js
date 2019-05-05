const http = require("http");
const { app } = require("../express");
// Create server
const server = http.createServer(app);

exports.server = server;
