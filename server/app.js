import express from "express";
import cors from "cors";
import { mongo } from "mongoose";
import mongoSanitize from "express-mongo-sanitize";
import companyRouter from "./routes/companyRouter.js";
const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
// app.use(mongoSanitize());

app.use("/api/company", companyRouter);
export default app;
