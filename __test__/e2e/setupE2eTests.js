import axios from "axios";
import startExpressApp, {
  server,
} from "../../src/adapters/express-adapter/index.js";
import dotenv from "dotenv";
import path from "path";

const PORT = process.env.PORT || 5000;
beforeAll(() => {
  dotenv.config({
    path: path.resolve(process.cwd(), "./src/config.env"),
  });

  axios.defaults.baseURL = `http://localhost:${PORT}`;
  axios.defaults.headers.common["Content-Type"] = "application/json";
  axios.defaults.validateStatus = function (status) {
    // Throw only if the status code is greater than or equal to 500
    return status < 500;
  };
  startExpressApp();
});

afterAll((done) => {
  server.close();
  done();
});
