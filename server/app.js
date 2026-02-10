import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";

import mongoSanitize from "express-mongo-sanitize";
import companyRouter from "./routes/companyRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
// app.use(mongoSanitize());
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/company", companyRouter);
app.use("/api/review", reviewRouter);

app.use((req, res) => {
  res.status(404).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "fail",
        message: "File size too large. Maximum size is 5MB",
      });
    }
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }

  console.error("Error:", err);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Internal server error",
  });
});

export default app;
