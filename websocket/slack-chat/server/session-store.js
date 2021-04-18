class SessionStore {
  findSession(id) {
    throw new Error("Not implemented");
  }

  saveSession(id, value) {
    throw new Error("Not implemented");
  }

  findAllSessions() {
    throw new Error("Not implemented");
  }
}

class InMemorySessionStore extends SessionStore {
  constructor(params) {
    super();
    this.session = new Map();
  }

  findSession(id) {
    return this.session.get(id);
  }

  saveSession(id, value) {
    this.session.set(id, value);
  }

  findAllSessions() {
    return [...this.session.values()];
  }
}

class RedisSessionStore extends SessionStore {
  constructor(redisConn) {
    super();
    this.redisConn = redisConn;
  }

  async findSession(id) {
    const res = await this.redisConn.hmget(
      `session:${id}`,
      "userID",
      "username",
      "connected",
    );
    const [userID, username, connected] = res;
    return {
      userID: parseFloat(userID),
      username,
      connected: connected === "true" ? true : false,
    };
  }

  saveSession(id, { username, userID, connected }, sessionTTL = 1800) {
    const key = `session:${id}`;
    return this.redisConn
      .multi()
      .hset(key, "username", username, "userID", userID, "connected", connected)
      .expire(key, sessionTTL)
      .exec();
  }

  findAllSessions() {
    return new Promise((resolve, reject) => {
      this.redisConn.keys("session:*", async (err, keys) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const res = await Promise.all(
            keys.map((k) => this.findSession(k.split(":")[1])),
          );
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = {
  InMemorySessionStore,
  RedisSessionStore,
};
