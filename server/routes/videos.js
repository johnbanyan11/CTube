import express from "express";
import {
  addVideo,
  addView,
  deleteVideo,
  getByTag,
  getVideo,
  random,
  search,
  trend,
  updateVideo,
} from "../controllers/video.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { subscribe, unsubscribe } from "../controllers/user.js";

const router = express.Router();

router.post("/", verifyToken, addVideo);
router.put("/:id", verifyToken, updateVideo);
router.delete("/:id", verifyToken, deleteVideo);
router.get("/find/:id", getVideo);
router.put("/view/:id", addView);
router.get("/trend", trend);
router.get("/random", random);
router.get("/sub", verifyToken, subscribe);
router.get("/unsub", verifyToken, unsubscribe);
router.get("/tags", getByTag);
router.get("/search", search);

export default router;
