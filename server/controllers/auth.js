import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const signup = async (req, res, next) => {
  try {
    console.log(req.body);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash);
    const newUser = new User({ ...req.body, password: hash });
    console.log(newUser);
    await newUser.save(function (err) {
      if (err) {
        console.log(err);
        return;
      }
    });
    res.status(200).send("User has been created...");
    console.log("user saved");
    // });
  } catch (error) {
    next(createError(404, "Invalid data..."));
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ name: req.body.name });
    if (!user) return next(createError(404, "user not found..."));

    const isCorrect = bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "password mismatch..."));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    console.log(token);
    const { password, ...others } = user._doc;
    console.log(user._doc);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(others);
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user._doc);
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(savedUser._doc);
    }
  } catch (error) {
    next(error);
  }
};
