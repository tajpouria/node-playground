class InMemoryMessageStore {
  constructor() {
    this.store = new Map();
  }

  append(userID, msg) {
    const prev = this.store.get(userID) || [];
    prev.push(msg);
    this.store.set(userID, prev);
  }
}

class RedisMessageStore {
  constructor(redisConn) {
    this.redisConn = redisConn;
  }

  append(msg, conversationTTL = 1800) {
    const val = JSON.stringify(msg);
    const fkey = `message:${msg.from}`;
    const tkey = `message:${msg.to}`;
    return this.redisConn
      .multi()
      .rpush(fkey, val)
      .rpush(tkey, val)
      .expire(fkey, conversationTTL)
      .expire(tkey, conversationTTL)
      .exec();
  }

  async find(userID) {
    const msgs = await this.redisConn.lrange(`message:${userID}`, 0, -1);
    console.info(msgs);
    return msgs.map((m) => JSON.parse(m));
  }
}

module.exports = { InMemoryMessageStore, RedisMessageStore };
