const express = require("express");
const Joi = require("joi");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "hdb2dev",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//GAMES
app.get("/api/games", async (req, res) => {
  //Queries: id(int, GameId), title(string, GameTitle)
  //Undefined queries returns full mission list
  let gameId = req.query.id ? req.query.id : "%";
  let title = req.query.title ? "%" + req.query.title + "%" : "%";

  await pool.execute(
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
            AND Games.GameTitle LIKE ?\
        GROUP BY Games.GameId\
        ORDER BY Games.GameId',
    [gameId, title],
    function(err, data) {
      if (err) return res.send(err);
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

      res.json(data);
    }
  );
});

//MISSIONS
app.get("/api/missions", async (req, res) => {
  //Queries: game(int, GameId), mission(string, MissionTitle), missionid(int)
  //Undefined queries returns full mission list
  let gameId = req.query.game ? req.query.game : "%";
  let title = req.query.mission ? "%" + req.query.mission + "%" : "%";
  let id = req.query.id ? req.query.id : "%";

  await pool.execute(
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
        ORDER BY Missions.GameId, Missions.MissionNumber",
    [title, gameId, id],
    function(err, data) {
      if (err) return res.send(err);
      res.json(data);
    }
  );
});

//ELUSIVES
app.get("/api/elusives", async (req, res) => {
  //Queries: location(string, ElusiveLocation)
  //Undefined queries returns full ET list
  let location = req.query.location ? "%" + req.query.location + "%" : "%";

  await pool.execute(
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
        WHERE MissionTitle LIKE ?\
        GROUP BY Elusives.ElusiveId\
        ORDER BY FullDate',
    [location],
    function(err, data) {
      if (err) return res.send(err);
      res.json(data);
    }
  );
});

//ESCALATIONS
app.get("/api/escalations", async (req, res) => {
  //Queries: location(string, ElusiveLocation)
  //Undefined queries returns full ET list
  let location = req.query.location ? "%" + req.query.location + "%" : "%";

  await pool.execute(
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
        WHERE MissionTitle LIKE ?\
        GROUP BY Escalations.EscalationId\
        ORDER BY FullDate',
    [location],
    function(err, data) {
      if (err) return res.send(err);
      res.json(data);
    }
  );
});

//Contracts
app.get("/api/contracts", async (req, res) => {
  //Queries:
  //  location(string, ContractLocation),
  //  creator (string, UserName),
  //  title(string, ContractTitle),
  //  platform(string, pc/ps4/x1)
  //Undefined queries returns full ET list
  let location = req.query.location ? "%" + req.query.location + "%" : "%";
  let creator = req.query.creator ? "%" + req.query.creator + "%" : "%";
  let title = req.query.title ? "%" + req.query.title + "%" : "%";
  let platform = "Contracts.ContractId";
  if (["pc", "x1", "ps4"].includes(req.query.platform)) {
    platform = "Contract" + req.query.platform.toUpperCase();
  }

  console.log(platform);

  await pool.execute(
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
            AND ' +
      platform +
      ' != ""\
          GROUP BY Contracts.ContractId\
          ORDER BY Contracts.ContractId\
          LIMIT 30',
    [title, creator, location],
    function(err, data) {
      if (err) return res.send(err);
      res.json(data);
    }
  );
});

app.listen(port, () => {
  console.log(`listening port ${port}`);
});

/*
//return one course based on id
app.get('/api/courses/:id', (req, res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        res.status(404).send('course not found');
    } else {
        res.send(course);
    }
});
/
//add course, takes in name
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body); //result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.send(course);
});

//update course based on id
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        res.status(404).send('course not found');
        return;
    }
    
    const { error } = validateCourse(req.body) //result.error
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);
});

app.delete('/api/courses/:id', (req, res) => {
    //löytyykö ollenkaan
    const course = courses.find(c => c.id === parseInt(req.params.id))
    if (!course) {
        res.status(404).send('course not found');
        return;
    }

    //delete
    const index = courses.indexOf(course);
    courses.splice(index, 1);
    
    //retuyrn deleted course to client
    res.send(course);
});
 */
//listen port
