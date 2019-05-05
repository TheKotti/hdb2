const { nconf } = require("./config");
const { server } = require("./components/server");
// Config
const port = nconf.get("SERVER_PORT") || 3000;
// Server init
server.listen(port, "localhost");
server.on("listening", async () => {
  console.log(
    `Server listening on ${server.address().address}:${server.address().port}`
  );
});
