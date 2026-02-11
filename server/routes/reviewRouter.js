import express from "express";
import {
  createReview,
  deleteOneReview,
  getAllRevies,
  getOneReview,
} from "../controllers/reviewControllers.js";

const router = express.Router();

router.route("/").post(createReview).get(getAllRevies);
router.route("/:id").get(getOneReview).delete(deleteOneReview);

export default router;
