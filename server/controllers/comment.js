import { createError } from "../error.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

export const addComment = async (req, res, next) => {
  console.log(req.body);
  console.log("comment");
  const newComment = new Comment({ ...req.body.data, userId: req.user.id });
  try {
    const savedComment = await newComment.save();
    res.status(200).send(savedComment);
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    const video = await Video.findById(req.params.id);
    if (req.user.id === comment.userId || req.user.id === video.userId) {
      await Comment.findByIdAndDelete(req.params.id);
      res.status(200).json("comment has been deleted");
    } else {
      return next(createError(403, "you can delete only your comment"));
    }
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
