import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Loader,
  Grid,
  Header,
  Segment,
  Rating,
  Statistic,
  Icon,
  List
} from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./FullMission.css";
import config from "../../config";
const { protocol, host, port } = config(
  process.env.NODE_ENV.toString() || "development"
);
const axios = require("axios");
var _ = require("lodash");

//Main view for a main mission

class FullMission extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mission: {},
      ratingCount: "",
      avgScore: "",
      rated: false
    };

    this.handleRate = this.handleRate.bind(this);
  }

  async componentDidMount() {
    const missionId = this.props.location.pathname.split("/").pop();
    try {
      const { data } = await axios.get(
        `${protocol}://${host}:${port}/api/missions`,
        {
          params: {
            id: missionId
          }
        }
      );
      this.setState({
        mission: data[0],
        ratingCount: data[0].RatingCount,
        avgScore: data[0].AVGScore
      });
    } catch (error) {
      console.log(error);
    }
  }

  handleRate = (e, { rating }) => {
    if (!this.state.rated) {
      this.setState(prevState => {
        return {
          rated: rating,
          ratingCount: prevState.ratingCount + 1,
          avgScore: (
            (prevState.avgScore * prevState.ratingCount + rating) /
            (prevState.ratingCount + 1)
          ).toFixed(1)
        };
      });
    } else {
      this.setState(prevState => {
        return {
          rated: rating,
          avgScore: (
            (prevState.avgScore * prevState.ratingCount -
              prevState.rated +
              rating) /
            prevState.ratingCount
          ).toFixed(1)
        };
      });
    }
  };

  render() {
    let briefing;
    if (!_.isEmpty(this.state.mission)) {
      if (
        this.state.mission.MissionAbout &&
        this.state.mission.MissionAbout.includes("youtube")
      ) {
        briefing = (
          <iframe
            id="ytplayer"
            type="text/html"
            width="640"
            height="360"
            src={this.state.mission.MissionAbout}
            frameBorder="0"
          />
        );
      } else {
        briefing = <pre>{this.state.mission.MissionAbout}</pre>;
      }

      return (
        <div className="missionGrid">
          <Grid columns="equal">
            <Grid.Row>
              <Grid.Column textAlign="center">
                <Segment>
                  <Header size="large">
                    {this.state.mission.MissionTitle}
                  </Header>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Header dividing>Details</Header>
                  <List bulleted>
                    <List.Item>
                      <Link to={`../game/${this.state.mission.GameId}`}>
                        {this.state.mission.GameTitle}
                      </Link>
                    </List.Item>
                    <List.Item>
                      Mission number {this.state.mission.MissionNumber}
                    </List.Item>
                  </List>
                </Segment>
              </Grid.Column>
              <Grid.Column textAlign="center">
                <Segment>
                  <Header dividing textAlign="left">
                    Rating
                  </Header>
                  <Rating
                    size="huge"
                    icon="star"
                    defaultRating={0}
                    maxRating={5}
                    onRate={this.handleRate}
                  />
                  <Statistic size="mini">
                    <Statistic.Value>
                      <Icon name="star" color="yellow" />
                      {this.state.avgScore}
                    </Statistic.Value>
                    <Statistic.Label>
                      {this.state.ratingCount} ratings
                    </Statistic.Label>
                  </Statistic>
                </Segment>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Header dividing>Briefing</Header> {briefing}
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

export default FullMission;
