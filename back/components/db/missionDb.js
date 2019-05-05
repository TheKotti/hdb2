const { pool } = require("../mysql");

class Mission {
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
  //Returns data on all missions if no param is given
  //If param is given, returns matching missions
  static async getMissions(param = ["%", "%", "%"]) {
    let queryString =
      "SELECT\
    Missions.MissionId,\
    MissionTitle,\
    MissionAbout,\
    GameTitle,\
    Games.GameId,\
    MissionNumber,\
    ROUND(AVG(RatingScore),1) AS AVGScore,\
    COUNT(RatingScore) AS RatingCount\
    FROM Missions\
    INNER JOIN Games\
        ON Games.GameId = Missions.GameId\
    LEFT OUTER JOIN MissionRatings\
        ON MissionRatings.MissionId = Missions.MissionId\
    WHERE MissionTitle LIKE ?\
        AND Missions.GameId LIKE ?\
        AND Missions.MissionId LIKE ?\
    GROUP BY Missions.MissionId\
    ORDER BY Missions.GameId, Missions.MissionNumber";
    return this.query(queryString, param);
  }
}

exports.Mission = Mission;
