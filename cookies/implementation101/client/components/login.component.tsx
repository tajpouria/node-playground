import * as React from "react";

import { useHandleChange } from "../hooks";
import { login, User } from "../http";

export default () => {
  const { values, handleChange } = useHandleChange<User>({
    username: "",
    password: "",
    email: "",
    repeatPassword: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await login(values);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Sign In</h3>

      <div className="form-group">
        <label>User Name</label>
        <input
          name="username"
          type="text"
          className="form-control"
          placeholder="Enter username"
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
          required
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary btn-block">
        Submit
      </button>
    </form>
  );
};
