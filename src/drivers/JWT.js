import jwt from "jsonwebtoken";

const token = {
  create(data) {
    return jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });
  },
  resolve(providedToken) {
    try {
      return jwt.verify(providedToken, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  },
};

export default token;
