import express from "express";
import {
  createReview,
  getAllRevies,
} from "../controllers/reviewControllers.js";
import { get } from "mongoose";
const Router = express.Router();

Router.route("/").post(createReview).get(getAllRevies);

export default Router;
