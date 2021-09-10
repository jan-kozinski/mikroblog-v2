import RedisSessions from "redis-sessions";
import util from "util";
const rs = new RedisSessions();

const rsapp = "mikroblog-web-client";

export const token = {
  async create({ ip, ...data }) {
    const promise = util.promisify(rs.create);
    const { token } = await promise({
      app: rsapp,
      id: data.id,
      ip,
      ttl: 3600,
      d: {
        ...data,
      },
    });
    return token;
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
      throw error;
    }
  },
};

process.on("beforeExit", () => {
  rs.quit(() => console.log("Closing redis connection..."));
});

export default token;
