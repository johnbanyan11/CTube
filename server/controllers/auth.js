import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../error.js";

export const signup = async (req, res, next) => {
  try {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });
    await newUser.save();
    // console.log(newUser);
    const token = jwt.sign({ id: newUser._id }, process.env.JWT);
    const { password, ...others } = newUser._doc;
    res.status(200).json({ others, token });
    console.log(others, token);
    // res.status(200).send("User has been created...");
  } catch (error) {
    next(createError(404, "Invalid data..."));
  }
};

export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "user not found..."));

    const isCorrect = bcrypt.compare(req.body.password, user.password);
    if (!isCorrect) return next(createError(400, "password mismatch..."));

    const token = jwt.sign({ id: user._id }, process.env.JWT);
    const { password, ...others } = user._doc;
    res.status(200).json({ others, token });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res.status(200).json({ user, token });
    } else {
      const newUser = new User({
        ...req.body,
        fromGoogle: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, process.env.JWT);
      res.status(200).json({ savedUser, token });
    }
  } catch (error) {
    next(error);
  }
};
