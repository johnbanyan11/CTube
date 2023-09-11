import mongoose from "mongoose";

const HistoryShema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    videoId: {
      type: String,
      required: true,
    },
    videoData: {
      type: Object,
      required: true,
    },
    authorData: {
      type: Object,
      required: true,
    },
    watchDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("History", HistoryShema);
