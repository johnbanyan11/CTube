import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const verifyToken = (req, res, next) => {
  console.log(req.body.headers.Authorization);
  // console.log(req.body);
  if (
    req.body.headers.Authorization &&
    req.body.headers.Authorization.startsWith("Bearer")
  ) {
    const token = req.body.headers.Authorization.split(" ")[1];
    // console.log(token);
    // console.log("token");
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) return next(createError(403, "Token is not valid!"));
      req.user = user;
      // console.log("token is valid");
      next();
    });
  }
  // if (!token) return next(createError(401, "you are not authenticated..."));
};
