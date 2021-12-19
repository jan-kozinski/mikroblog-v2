import RedisSessions from "redis-sessions";
import util from "util";
const rs = new RedisSessions({ host: process.env.REDIS_URL || "127.0.0.1" });

const rsapp = process.env.REDIS_NAMESPACE || "mikroblog-web-client";

export const token = Object.freeze({
  async create({ ip, ...data }) {
    try {
      const promise = util.promisify(rs.create);
      const { token } = await promise({
        app: rsapp,
        id: data.id,
        ip,
        ttl: process.env.TOKEN_EXPIRATION,
        d: {
          ...data,
        },
      });
      return token;
    } catch (error) {
      console.error(error.message);
      throw new Error("Something went wrong...");
    }
  },
  async resolve(providedToken) {
    const promise = util.promisify(rs.get);
    try {
      const session = await promise({
        app: rsapp,
        token: providedToken,
      });
      return session.d;
    } catch (error) {
      console.error(error.message);
      throw new Error("Something went wrong...");
    }
  },
});

process.on("beforeExit", () => {
  rs.quit(() => console.log("Closing redis connection..."));
});

export default token;
