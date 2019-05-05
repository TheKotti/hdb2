import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Loader,
  Grid,
  Header,
  Segment,
  Statistic,
  Icon,
  List
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import config from "../../config";
const { protocol, host, port } = config(
  process.env.NODE_ENV.toString() || "development"
);
const axios = require("axios");
var _ = require("lodash");

//Main view for a game
//Currently only displays main missions

class FullGame extends Component {
  constructor(props) {
    super(props);

    this.state = {
      game: {}
    };
  }

  async componentDidMount() {
    const gameId = this.props.location.pathname.split("/").pop();
    try {
      const { data } = await axios.get(
        `${protocol}://${host}:${port}/api/games`,
        {
          params: {
            id: gameId
          }
        }
      );
      this.setState({
        game: data[0]
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (!_.isEmpty(this.state.game)) {
      const missions = this.state.game.Missions.map(mission => (
        <List.Item key={mission.MissionId} id={mission.MissionId}>
          <Link to={`../mission/${mission.MissionId}`}>
            {mission.MissionTitle}
          </Link>
        </List.Item>
      ));
      return (
        <div className="missionGrid">
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Segment>
                  <Header size="large">{this.state.game.GameTitle}</Header>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Header dividing>Missions</Header>
                  <List>{missions}</List>
                </Segment>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Segment>
                  <Header dividing textAlign="left">
                    Rating
                  </Header>
                  <Statistic size="mini">
                    <Statistic.Value>
                      <Icon name="star" color="yellow" />
                      {this.state.game.AVGScore} / 5.0
                    </Statistic.Value>
                    <Statistic.Label>
                      {this.state.game.RatingCount} mission ratings
                    </Statistic.Label>
                  </Statistic>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Header dividing>Briefing</Header> {}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      );
    } else {
      return <Loader active />;
    }
  }
}

export default FullGame;
