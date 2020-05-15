export interface User {
  username: string;
  email: string;
  password: string;
  repeatPassword: string;
}

export const signUp = (user: User) =>
  fetch("api/users", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
export const login = (user: Partial<User>) =>
  fetch("api/session", {
    method: "POST",
    body: JSON.stringify(user),
    headers: {
      "Content-Type": "application/json",
    },
  });
export const logout = () => fetch("api/session", { method: "DELETE" });
