class TaskQueue {
  constructor(redisConn) {
    this.redisConn = redisConn;
  }

  async appendTask(task) {
    const id = Math.random();
    await this.redisConn.set(`Task:${id}`, JSON.stringify(task));
    return id;
  }

  getTask(id) {
    return this.redisConn.get(`Task:${id}`, task);
  }

  getAllTask() {
    return new Promise((resolve, reject) => {
      this.redisConn.keys("Task:*", async (err, keys) => {
        if (err) {
          reject(err);
          return;
        }
        try {
          const res = await Promise.all(
            keys.map((k) => this.getTask(k.split(":")[1])),
          );
          resolve(res);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

module.exports = { TaskQueue };
