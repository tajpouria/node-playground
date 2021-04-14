<template>
  <div>
    <ul>
      <li v-for="user in users" :key="user.userID">
        {{ user.username }}
      </li>
    </ul>
  </div>
</template>

<script>
import socket from "../socket";

export default {
  name: "Chat",

  data() {
    return {
      users: [],
    };
  },

  created() {
    socket.on("users", (users) => {
      this.users = users;
    });

    socket.on("user connected", (user) => {
      this.users.push(user);
    });
  },

  destroyed() {
    socket.off("users");
    socket.off("user connected");
  },
};
</script>
