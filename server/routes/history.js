import express from "express";

import { verifyToken } from "../middleware/verifyToken.js";
import { getHistory, markVideoAsWatched } from "../controllers/history.js";

const router = express.Router();

router.post("/", verifyToken, getHistory);
router.post("/:id", verifyToken, markVideoAsWatched);

export default router;
