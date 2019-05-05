import React, { Component } from "react";
import MissionPreview from "../MissionPreview";
import { Table, Loader } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import config from "../../config";
const { protocol, host, port } = config(
  process.env.NODE_ENV.toString() || "development"
);

//The list of main missions

const axios = require("axios");

class MissionList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      missions: []
    };
  }

  async componentDidMount() {
    try {
      const { data } = await axios.get(
        `${protocol}://${host}:${port}/api/missions`,
        {
          params: {
            game: "",
            title: "",
            id: ""
          }
        }
      );
      this.setState({ missions: data }, () => {
        console.log(this.state.missions[0]);
      });
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    let missionPreviews = this.state.missions.map(mission => {
      return <MissionPreview key={mission.MissionId} mission={mission} />;
    });

    if (this.state.missions.length > 0) {
      return (
        <Table celled selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Mission Title</Table.HeaderCell>
              <Table.HeaderCell>Game</Table.HeaderCell>
              <Table.HeaderCell>Average rating</Table.HeaderCell>
              <Table.HeaderCell>Your rating</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{missionPreviews}</Table.Body>
        </Table>
      );
    } else {
      return <Loader active />;
    }
  }
}

export default MissionList;
