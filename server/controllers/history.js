import History from "../models/History.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

export const markVideoAsWatched = async (req, res, next) => {
  try {
    const videoId = req.params.id;
    const userId = req.user.id; // Assuming user ID is stored in req.user.

    const video = await Video.findById(req.params.id);
    const videoAuthor = await User.findById(video?.userId);

    // console.log("vvvvvv", video);
    // console.log("aaaaaaa", videoAuthor);

    const videoData = {
      id: video?._id.toString(),
      title: video?.title,
      desc: video?.desc,
      imgUrl: video?.imgUrl,
      views: video?.views,
    };

    const authorData = {
      name: videoAuthor?.name,
      img: videoAuthor?.img,
    };

    const deletedRecord = await History.deleteOne({
      userId,
      videoId,
    });

    // Create a new record in the WatchedVideo collection.
    const watchedVideo = new History({
      userId,
      videoId,
      videoData,
      authorData,
    });
    await watchedVideo.save();

    res.status(201).json({ message: "Video marked as watched." });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const userId = req.user.id; // Assuming user ID is stored in req.user.

    // Find all watched videos for the currently authenticated user.
    const watchedVideos = await History.find({ userId })
      //   .populate("videoId", "title description") // Optionally populate video details.
      .sort({ watchDate: -1 }); // Sort by watchDate in descending order (most recent first).

    res.status(200).json(watchedVideos);
  } catch (error) {
    next(error);
  }
};
