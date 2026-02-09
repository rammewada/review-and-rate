import express from "express";
import cors from "cors";

import mongoSanitize from "express-mongo-sanitize";
import companyRouter from "./routes/companyRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
// app.use(mongoSanitize());

app.use("/api/company", companyRouter);
app.use("/api/review", reviewRouter);

// app.all("*", (req, res) => {
//   res
//     .status(404)
//     .json({ message: `Can't find ${req.originalUrl} on this server!` });
// });
export default app;
