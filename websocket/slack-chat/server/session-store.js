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

module.exports = {
  InMemorySessionStore,
};
