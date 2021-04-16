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

module.exports = { InMemoryMessageStore };
