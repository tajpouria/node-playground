<template>
  <div class="lobby">
    <ul>
      <li v-for="user in users" :key="user.userID">
        <button v-on:click="selectUser(user)" :disabled="isME(user)">
          {{ user.username }}
          <i v-if="isME(user)">(yourself)</i>
        </button>
        <i v-if="user.connected"> Online</i>
        <i v-else> Offline</i>

        <b v-if="user.hasNewMessage"> (!)</b>
      </li>
    </ul>
    <div>
      <div v-if="selectedUser">
        <p>
          Private chat with <b>{{ selectedUser.username }}</b>
        </p>
        <ul>
          <li v-for="m in selectedUser.messages" v-bind:key="Math.random(m)">
            <i v-if="m.fromSelf">yourself: </i>
            <i v-else>{{ selectedUser.username }}: </i>
            {{ m.content }}
          </li>
        </ul>
        <form @submit.prevent="handleSubmit">
          <textarea required placeholder="Type someting..." v-model="content" />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import socket from "../socket";

export default {
  name: "Lobby",

  props: ["me"],

  data() {
    return {
      users: [],
      selectedUser: null,
      content: "",
    };
  },

  methods: {
    handleSubmit() {
      socket.emit("private message", {
        content: this.content,
        to: this.selectedUser.userID,
      });
      this.selectedUser.messages.push({
        content: this.content,
        fromSelf: true,
      });
    },

    selectUser(user) {
      this.selectedUser = this.selectedUser === user ? null : user;
      if (this.selectedUser) {
        this.users = this.users.map((u) => {
          if (this.selectedUser.userID === u.userID) {
            u.hasNewMessage = false;
          }
          return u;
        });
      }
    },

    isME(user) {
      return user.userID === this.me.userID ? true : false;
    },
  },

  created() {
    socket.on("users", (users) => {
      this.users = users.map((u) => ({
        ...u,
        messages: [],
        hasNewMessage: false,
      }));
    });

    socket.on("private message", ({ content, from }) => {
      this.users = this.users.map((u) => {
        if (u.userID === from) {
          u.messages.push({
            content,
            fromSelf: false,
          });
          u.hasNewMessage =
            this.selectedUser && this.selectedUser.userID == from
              ? false
              : true;
        }

        return u;
      });
    });
  },

  destroyed() {
    socket.off("users");
    socket.off("user connected");
  },
};
</script>

<style scoped>
.lobby {
  display: flex;
  justify-content: space-around;
}
</style>
