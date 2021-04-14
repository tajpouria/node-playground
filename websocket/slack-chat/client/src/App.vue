<template>
  <div id="app">
    <div v-if="usernameAlreadySelected">
      <Lobby v-bind:username="user.username" />
    </div>
    <div v-else>
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
      this.usernameAlreadySelected = true;
      socket.auth = { username: this.user.username };
      socket.connect();
    },
  },

  created() {
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
