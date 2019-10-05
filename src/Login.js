import React, { Component } from "react";
import { GoogleLogin } from "react-google-login";
import config from "./config.json";

const URL = "ws://localhost:8080/test/websocketendpoint";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      direct: false,
      message: ""
    };
  }
  ws = new WebSocket(URL);
  componentDidMount() {
    const { direct, message } = this.state;
    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
    };
    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      console.log("Recieved:", evt.data);
      // this.setState({
      //   message: evt.data
      // });
    };
    this.ws.onclose = () => {
      console.log("disconnected");
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL)
      });
    };
  }
  //   addMessage = message => {
  //     this.setState(state => ({ return: message }));
  //     console.log(this.state.return);
  //   };

  signup = res => {
    const { direct, message } = this.state;
    console.log("Sent:", res);
    this.setState({
      direct: true
    });
    this.ws.send(JSON.stringify(res));
  };
  render() {
    const { direct } = this.state;
    const responseGoogle = response => {
      this.signup(response);
    };
    return (
      <div>
        {direct ? (
          <h1>Logged in</h1>
        ) : (
          <div>
            <h2>Login</h2>
            <GoogleLogin
              clientId={config.GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={responseGoogle}
              onFailure={responseGoogle}
            />
          </div>
        )}
      </div>
    );
  }
}
export default Login;
