import * as React from "react";
import * as ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import "./App.css";

import Login from "./components/login.component";
import SignUp from "./components/signup.component";
import { logout, me } from "./http";

function App() {
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      alert(error);
    }
  };

  const handleMe = async () => {
    try {
      const res = await me();
      alert(JSON.stringify(await res.json()));
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="xs-3">
          <SignUp />
        </div>
        <div className="xs-3">
          <Login />
        </div>
        <div className="px-10 xs-3">
          <button onClick={handleMe} className="btn btn-success">
            Me
          </button>
          <button onClick={handleLogout} className="btn btn-danger">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

const mountNode = document.getElementById("root");
ReactDOM.render(<App />, mountNode);
