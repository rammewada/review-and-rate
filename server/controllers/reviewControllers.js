import Review from "../models/reviewModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const createReview = catchAsync(async (req, res, next) => {
  const review = await Review.create(req.body);
  console.log(review);

  res.status(201).json({
    status: "Success",
    data: {
      review,
    },
  });
});

const getAllRevies = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    status: "Sucess",
    data: {
      reviews,
    },
  });
});

const getOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});

const deleteOneReview = catchAsync(async (req, res, next) => {
  const review = await Review.findByIdAndDelete(req.params.id);

  if (!review) {
    return next(new AppError("Review not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      review,
    },
  });
});
export { createReview, getAllRevies, getOneReview, deleteOneReview };
