import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import videoRoutes from "./routes/videos.js";
import commentRoutes from "./routes/comments.js";
import historyRoutes from "./routes/history.js";

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    throw err;
  });

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.use(
//   cors({
//     origin: ["http://localhost:3000", "https://ctube11.onrender.com"],
//   })
// );

app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("server started...");
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/history", historyRoutes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something went wrong!";
  return res.status(status).json({
    success: false,
    status,
    message,
  });
});

// --------------Deployement----------------//

const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`server listening on ${port}`);
});
