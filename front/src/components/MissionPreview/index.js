import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Table, Rating, Icon, Statistic, Header } from "semantic-ui-react";
import "semantic-ui-css/semantic.min.css";
import "./MissionPreview.css";

//One row in the list of main missions

class MissionPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      avgScore: this.props.mission.AVGScore,
      ratingCount: this.props.mission.RatingCount,
      rated: false
    };

    this.handleRate = this.handleRate.bind(this);
  }

  async componentDidMount() {}

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
    return (
      <Table.Row>
        <Table.Cell verticalAlign="middle" className="listItem">
          <Link to={`mission/${this.props.mission.MissionId}`}>
            <Header>{this.props.mission.MissionTitle}</Header>
          </Link>
        </Table.Cell>
        <Table.Cell verticalAlign="middle" className="listItem">
          <Header>{this.props.mission.GameTitle}</Header>
        </Table.Cell>
        <Table.Cell
          verticalAlign="middle"
          className="listItem"
          textAlign="center"
        >
          <Statistic size="mini" className="stat" horizontal>
            <Statistic.Value>
              <Icon name="star" color="yellow" />
              {this.state.avgScore}
            </Statistic.Value>
            <Statistic.Label className="ratingLabel">
              ({this.state.ratingCount} ratings)
            </Statistic.Label>
          </Statistic>
        </Table.Cell>
        <Table.Cell
          verticalAlign="middle"
          className="listItem"
          textAlign="center"
        >
          <Rating
            icon="star"
            defaultRating={0}
            maxRating={5}
            onRate={this.handleRate}
          />
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default MissionPreview;
