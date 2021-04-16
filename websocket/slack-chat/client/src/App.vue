<template>
  <div id="app">
    <div v-bind:style="{ display: usernameAlreadySelected ? 'block' : 'none' }">
      <Lobby v-bind:me="user" />
    </div>
    <div
      id="user-info"
      v-bind:style="{ display: usernameAlreadySelected ? 'none' : 'block' }"
    >
      <form @submit.prevent="handleSubmit">
        <label>
          username:
          <input type="text" v-model="user.username" required />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>

<script>
import socket from "./socket";
import Lobby from "./components/Lobby";

const SESSSION_ID_KEY = "_sess_id";

export default {
  name: "App",
  components: { Lobby },

  data() {
    return {
      usernameAlreadySelected: false,
      user: {
        username: "",
      },
    };
  },

  methods: {
    handleSubmit() {
      socket.auth = { username: this.user.username };
      socket.connect();
    },
  },

  created() {
    const sessionID = sessionStorage.getItem(SESSSION_ID_KEY);
    if (sessionID) {
      socket.auth = { sessionID };
      socket.connect();
    }

    socket.on("session", ({ sessionID, ...user }) => {
      this.user = user;
      this.usernameAlreadySelected = true;
      sessionStorage.setItem(SESSSION_ID_KEY, sessionID);
    });

    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
      }
    });
  },

  destroyed() {
    socket.off("connect_error");
  },
};
</script>

<style>
#app {
  width: 100vw;
}
</style>
