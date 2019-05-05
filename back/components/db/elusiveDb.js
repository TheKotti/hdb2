const { pool } = require("../mysql");

class Elusive {
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
  //Returns data on all elusives if no param is given
  //If param is given, returns matching elusives
  static async getElusives(param = ["%", "%", "%"]) {
    let queryString =
      'SELECT\
    Elusives.ElusiveId,\
    ElusiveTitle,\
    ElusiveAbout,\
    DATE_FORMAT(ElusiveDate,"%d %b %Y") AS ElusiveDate,\
    DATE_FORMAT(ElusiveDateH2,"%d %b %Y") AS ElusiveDateH2,\
    ElusiveDate AS FullDate,\
    ElusiveFullName,\
    MissionTitle,\
    ROUND(AVG(RatingScore),1) AS AVGScore,\
    COUNT(RatingScore) AS RatingCount\
    FROM Elusives\
    LEFT OUTER JOIN ElusiveRatings\
        ON ElusiveRatings.ElusiveId = Elusives.ElusiveId\
    INNER JOIN Missions\
      ON Missions.MissionId = Elusives.MissionId\
    WHERE Elusives.ElusiveId LIKE ?\
      AND Elusives.ElusiveTitle LIKE ?\
      AND MissionTitle LIKE ?\
    GROUP BY Elusives.ElusiveId\
    ORDER BY FullDate';
    return this.query(queryString, param);
  }
}

exports.Elusive = Elusive;
