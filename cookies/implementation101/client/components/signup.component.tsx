import * as React from "react";

import { useHandleChange } from "../hooks";
import { signUp, User } from "../http";

export default () => {
  const { values, handleChange } = useHandleChange<User>({
    username: "",
    password: "",
    email: "",
    repeatPassword: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.password !== values.repeatPassword) {
      alert("Passwords doesn't match!");
      return;
    }

    try {
      await signUp(values);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      <div className="form-group">
        <label>User Name</label>
        <input
          name="username"
          type="text"
          className="form-control"
          placeholder="Enter user name"
          required
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Email address</label>
        <input
          name="email"
          type="email"
          className="form-control"
          placeholder="Enter email"
          required
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          name="password"
          type="password"
          className="form-control"
          placeholder="Enter password"
          onChange={handleChange}
        />
      </div>

      <div className="form-group">
        <label>Repeat Password</label>
        <input
          name="repeatPassword"
          type="password"
          className="form-control"
          placeholder="Enter password"
          required
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Sign Up
      </button>
      <p className="forgot-password text-right">
        Already registered <a href="#">sign in?</a>
      </p>
    </form>
  );
};
