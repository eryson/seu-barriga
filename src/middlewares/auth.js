import jwt from "jsonwebtoken";
import { promisify } from "util";

const middleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(400).json({ message: "Token not provided" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.APP_SECRET);

    req.userId = decoded.id;
    req.admin = decoded.admin;

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default middleware;
