const { nconf } = require("../../config");
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: nconf.get("MYSQL_HOST"),
  user: nconf.get("MYSQL_USER"),
  database: nconf.get("MYSQL_DB"),
  waitForConnections: true,
  connectionLimit: nconf.get("MYSQL_CONNECTIONLIMIT"),
  queueLimit: nconf.get("MYSQL_QUEUELIMIT")
});
const promisePool = pool.promise();

exports.pool = promisePool;
