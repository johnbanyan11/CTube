import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = (req, res, next) => {
  console.log("reee", req.body);
  if (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith("Bearer")
  ) {
    const token = req.body.headers.Authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      next();
    });
  }
};
