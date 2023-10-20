import type { RedisClientType } from "@redis/client";
const SESSION_TTL = 24 * 60 * 60;
export type Tsession = {
  userId: string;
  connected: number;
};

export class RedisSessionStore {
  redisClient: RedisClientType;
  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient
  }

  findSession(id: string) {
    return this.redisClient.hGetAll(`session:${id}`);
  }

  async findAllSession() {
    const sessions = [];
    for await (const key of this.redisClient.scanIterator({
      MATCH: "session:*",
      COUNT: 100,
    })) {
      const value = await this.redisClient.hGetAll(key);
      sessions.push(value);
    }
    return sessions
  }

  async matchSession() {
    for await (const { field, value } of this.redisClient.hScanIterator('0')) {
      console.log(field)
    }
  }

  async saveSession(id: string, session: Tsession) {
    return this.redisClient
      .multi()
      .hSet(`session:${id}`, session)
      .expire(`session:${id}`, SESSION_TTL)
      .exec();
  }
}
