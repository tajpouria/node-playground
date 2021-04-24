<template>
  <div id="app">
    HELLO

    <button v-on:click="initTask">Init task</button>
  </div>
</template>

<script>
import socket from "./socket";

export default {
  name: "App",

  data() {
    return {};
  },

  methods: {
    initTask() {
      socket.emit("INIT_TASK", {});
    },
  },

  created() {
    socket.connect();
  },
};
</script>

<style>
#app {
  width: 100vw;
}
</style>
