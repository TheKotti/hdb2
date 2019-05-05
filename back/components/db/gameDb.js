const { pool } = require("../mysql");

class Game {
  static async query(q, v) {
    try {
      //Query instead of execute to avoid errors
      const res = await pool.query(q, v);
      let data = res[0];
      //Parse mission titles and ids into objects
      data.forEach(e => {
        e.MissionIds = JSON.parse(e.MissionIds);
        e.MissionTitles = e.MissionTitles.split(",");
        e.Missions = [];
        for (var i = 0; i < e.MissionIds.length; i++) {
          e.Missions[i] = {
            MissionId: e.MissionIds[i],
            MissionTitle: e.MissionTitles[i]
          };
        }
        delete e.MissionTitles;
        delete e.MissionIds;
      });
      return data;
    } catch (err) {
      console.log(err.stack);
      throw err;
    }
  }
  //Returns data on all games if no param is given
  //If param is given, returns game data on game with matching GameId
  static async getGames(param = ["%"]) {
    let queryString =
      'SELECT\
    Games.GameId,\
    GameTitle,\
    DATE_FORMAT(GameDate,"%d %b %Y") AS GameDate,\
    GameDate AS FullDate,\
    GROUP_CONCAT(DISTINCT MissionTitle ORDER BY MissionNumber) AS MissionTitles,\
    CONCAT("[", GROUP_CONCAT(DISTINCT Missions.MissionId) ,"]") AS MissionIds,\
    ROUND(AVG(MissionRatings.RatingScore),1) AS AVGScore,\
    COUNT(MissionRatings.RatingScore) AS RatingCount\
    FROM Games\
    INNER JOIN Missions\
        ON Games.GameId = Missions.GameId\
    INNER JOIN MissionRatings\
        ON MissionRatings.MissionId = Missions.MissionId\
    WHERE Games.GameId LIKE ?\
    GROUP BY Games.GameId\
    ORDER BY Games.GameId';
    return this.query(queryString, param);
  }
}

exports.Game = Game;
