import React, { Component } from "react";
import axios from "axios";
import jwt from "jsonwebtoken";
import config from "../../config";
import { Button, Checkbox, Form } from "semantic-ui-react";
const { protocol, host, port } = config(
  process.env.NODE_ENV.toString() || "development"
);

//Probably just a placeholder

class LoginForm extends Component {
  state = { username: "", password: "", namething: "" };

  componentDidMount() {
    const token = localStorage.getItem("user-token");
    if (token) {
      const userdata = jwt.decode(token);
      console.log(userdata);
      console.log(userdata.user[0].UserName);
      this.setState({ namething: userdata.user[0].UserName });
    } else {
      console.log("no jwt found");
    }
  }

  handleChange = (e, { name, value }) => this.setState({ [name]: value });

  handleLogin = async () => {
    const { username, password } = this.state;
    const userData = {
      Username: username,
      Password: password
    };
    console.log(username, password);
    const loginRes = await axios.post(
      `${protocol}://${host}:${port}/api/login`,
      userData
    );
    console.log(loginRes.data.token);
    localStorage.setItem("user-token", loginRes.data.token);
    const userdata = jwt.decode(loginRes.data.token);
    this.setState({ namething: userdata.user[0].UserName });
  };

  handleLogout = () => {
    localStorage.removeItem("user-token");
    this.setState({ namething: "" });
  };

  render() {
    const { username, password } = this.state;
    if (this.state.namething) {
      return (
        <div>
          <p>Logged in as {this.state.namething}</p>
          <Button onClick={this.handleLogout}>Log out</Button>
        </div>
      );
    } else {
      return (
        <Form onSubmit={this.handleLogin}>
          <Form.Group>
            <Form.Input
              placeholder="Username"
              name="username"
              value={username}
              onChange={this.handleChange}
            />
            <Form.Input
              placeholder="Password"
              name="password"
              value={password}
              onChange={this.handleChange}
            />
            <Form.Button content="Log in" />
          </Form.Group>
        </Form>
      );
    }
  }
}

export default LoginForm;
