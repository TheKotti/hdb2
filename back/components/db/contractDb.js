const { pool } = require("../mysql");

class Contract {
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
  //Returns data on all contracts if no param is given
  //If param is given, returns matching contracts
  static async getContracts(
    param = ["%", "%", "%", "%", "%" ,"%"],
    platform = "Contracts.ContractId"
  ) {
    let queryString =
      'SELECT\
    Contracts.ContractId,\
    ContractTitle,\
    ContractAbout,\
    DATE_FORMAT(ContractDate,"%d %b %Y") AS ContractDate,\
    ContractDate AS FullDate,\
    MissionTitle,\
    ContractTargets,\
    ContractPS4,\
    ContractPC,\
    ContractX1,\
    UserName,\
    GameTitle,\
    ROUND(AVG(RatingScore),1) AS AVGScore,\
    COUNT(RatingScore) AS RatingCount\
    FROM Contracts\
    INNER JOIN Users\
        ON Contracts.UserId = Users.UserId\
    INNER JOIN Games\
        ON Contracts.GameId = Games.GameId\
    INNER JOIN Missions\
        ON Contracts.MissionId = Missions.MissionId\
    LEFT OUTER JOIN ContractRatings\
        ON ContractRatings.ContractId = Contracts.ContractId\
    WHERE ContractTitle LIKE ?\
        AND UserName LIKE ?\
        AND MissionTitle LIKE ?\
        AND Contracts.GameId LIKE ?\
        AND Contracts.ContractId LIKE ?\
        AND Contracts.UserId LIKE ?\
        AND ' +
      platform +
      ' != ""\
      GROUP BY Contracts.ContractId\
      ORDER BY Contracts.ContractId\
      LIMIT 3000';
    return this.query(queryString, param);
  }
}

exports.Contract = Contract;
