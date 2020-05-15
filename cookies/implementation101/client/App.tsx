import * as React from "react";
import * as ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="xs-3">
          <SignUp />
        </div>
        <div className="xs-3">
          <Login />
        </div>
      </div>
    </div>
  );
}

const mountNode = document.getElementById("root");
ReactDOM.render(<App />, mountNode);
