import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("DB connection successfull ✅");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT} 🚀`);
});
