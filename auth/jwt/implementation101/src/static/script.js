Vue.component("login-form", {
  template: `
  <form @submit.prevent="handleSubmit">
    <h1>{{method}} Login</h1>
    <label for="username">
      UserName: 
      <input type="text" v-model="values.username" id="username" required >
    </label>
    <br>
    <label for="password">
      Password: 
      <input type="password" v-model="values.password" id="password" required >
    </label>
    <br>
    <label for="role">
      role: 
      <select type="text" v-model="values.role" id="role" required>
        <option value="admin">admin</option>
        <option value="user">user</option>
      </select>
    </label>
    <br>
    <button type="submit">Login</button>
  </form>`,

  data() {
    return {
      values: {
        username: null,
        password: null,
        role: "user",
      },
    };
  },

  methods: {
    async handleSubmit() {
      const { username, password, role } = this.values;

      try {
        const res = await fetch(`${UNIFORM_RESOURCE_LOCATION}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            password,
            role,
          }),
        });

        const response = await res.json();

        const { token } = response;
        if (token) {
          localStorage.setItem("token", token);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },

  computed: {
    method() {
      return detectMethod();
    },
  },
});

const app = new Vue({
  el: "#app",
  template: `
    <div>
      <a href="/${detectMethod()}/lobby">$ Lobby</a>
      <login-form />
    </div>
  `,
  data: {},
});

function detectMethod() {
  return UNIFORM_RESOURCE_LOCATION.includes("session") ? "session" : "jwt";
}
