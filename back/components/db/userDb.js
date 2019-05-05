const { pool } = require("../mysql");

class User {
  static async query(q, v) {
    try {
      const res = await pool.execute(q, v);
      let data = res[0];
      return data;
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }

  //Returns userdata
  static async getUser(username, password) {
    let queryString =
      "SELECT\
    UserName,\
    UserId\
    FROM Users\
    WHERE UserName = ?\
      AND UserPassWord = ?";
    return this.query(queryString, [username, password]);
  }
}

exports.User = User;
