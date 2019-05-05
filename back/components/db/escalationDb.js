const { pool } = require("../mysql");

class Escalation {
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
  //Returns data on all escalations if no param is given
  //If param is given, returns matching escalations
  static async getEscalations(param = ["%", "%", "%"]) {
    let queryString =
      'SELECT\
    Escalations.EscalationId,\
    EscalationTitle,\
    EscalationAbout,\
    DATE_FORMAT(EscalationDate,"%d %b %Y") AS EscalationDate,\
    DATE_FORMAT(EscalationDateH2,"%d %b %Y") AS EscalationDateH2,\
    EscalationDate AS FullDate,\
    MissionTitle,\
    ROUND(AVG(RatingScore),1) AS AVGScore,\
    COUNT(RatingScore) AS RatingCount\
    FROM Escalations\
    LEFT OUTER JOIN EscalationRatings\
        ON EscalationRatings.EscalationId = Escalations.EscalationId\
    INNER JOIN Missions\
        ON Missions.MissionId = Escalations.MissionId\
    WHERE Escalations.EscalationId LIKE ?\
      AND Escalations.EscalationTitle LIKE ?\
      AND MissionTitle LIKE ?\
    GROUP BY Escalations.EscalationId\
    ORDER BY FullDate';
    return this.query(queryString, param);
  }
}

exports.Escalation = Escalation;
