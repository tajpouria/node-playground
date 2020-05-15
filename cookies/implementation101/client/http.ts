export interface User {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

const BASE_URL = "http://127.0.0.1:8080/";

export const signUp = (user: User) =>
  fetch(`${BASE_URL}api/users`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const login = (user: Partial<User>) =>
  fetch(`${BASE_URL}api/session`, {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });

export const logout = () =>
  fetch(`${BASE_URL}api/session`, { method: "DELETE" });

export const me = () => fetch(`${BASE_URL}api/session`, { method: "GET" });
