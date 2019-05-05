import React, { Component } from "react";
import "./App.css";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import MissionList from "./components/MissionList";
import FullMission from "./components/FullMission";
import FullGame from "./components/FullGame";

class App extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {}

  render() {
    return (
      <BrowserRouter>
        <Switch>
          {/* <Route
            path="/"
            exact
            render={props => <LoginForm submit={this.submit} {...props} />}
          /> */}
          <Route path="/" exact component={MissionList} />
          <Route path="/login" exact component={LoginForm} />
          <Route path="/missions" exact component={MissionList} />
          <Route path="/mission/:id" exact component={FullMission} />
          <Route path="/game/:id" exact component={FullGame} />
          <Route path="/" render={() => <Redirect to="/" />} />
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;
