## Database

Mysql database. The idea behind the updated database is to not just be a resource for in game content, but also to work as a more detailed leaderboard.

- Every piece of content is tied to one game
- ETs and escalations that were originally in H2016 are tied to H2016, but have a column for their H2 release date
- Every content type (games, missions, contracts...) also has tables that allow users to add videos and comments to them, and other users to add likes to the videos and comments
- When adding a video, user can give it tags (SA, speedrun, battleaxe...) that can be used for filtering
- Rating different content is now on a 1-5 scale
- Games don't have their own rating, but instead use the average rating of the missions they contain
- Other content is intended for things such as Hitman GO, the Sniper Assassin maps and holiday content
- Resources is intended for fan made resources such as randomizers, maps, or mods.

## Backend

NodeJS, currently only gets various content. Example:

- localhost:5000/api/escalations, for all escalations
- localhost:5000/api/escalations?id=12, for one escalation
- localhost:5000/api/escalations?title=meiko, for escalations with "meiko" in the title

## Frontend

ReactJS, only a few components for displaying a mission list and mission and game details. Overall layout with navbar/login/other info needed.

## Getting started

When everything breaks, contact Kotti#4747 on Discord because he doesn't know what he's doing

#### DB

Create a MySQL schema called hdb2dev and import the included .sql file. In addition to the structure, it contains some test data, mainly related to missions.

#### Backend

In the backend folder, run the following commands:

```
npm install
npm install -g nodemon (if you don't have nodemon installed)
npm update
nodemon start
```

If everything is fine, you should see a list of missions at localhost:5000/api/missions

#### Frontend

In the frontend folder, run the following commands:

```
npm install
npm update
npm start
```

If everything is fine, you should see a list of missions at localhost:3000/missions
