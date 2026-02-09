import mongoose from "mongoose";
import Company from "./companyModel.js";

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Reviewer must have a name"],
    minLength: [3, "Reviewer name must be at least 3 characters"],
    maxLength: [50, "Reviewer name must be less than 50 characters"],
    trim: true,
  },
  content: {
    type: String,
    required: [true, "Review content is required"],
    minLength: [10, "Review content must be at least 10 characters"],
    maxLength: [1000, "Review content must be less than 1000 characters"],
    trim: true,
  },
  rating: {
    type: Number,
    max: [5, "Rating must be at most 5 starts"],
    min: [1, "Rating must be at least 1 star"],
    required: [true, "Rating is required"],
  },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: [true, "Review must belong to a company"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

reviewSchema.statics.calcAverageRatings = async function (companyId) {
  const stats = await this.aggregate([
    {
      $match: { company: companyId },
    },
    {
      $group: {
        _id: "$company",
        nRatings: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);

  if (stats.length > 0) {
    await Company.findByIdAndUpdate(companyId, {
      ratingsQuantity: stats[0].nRatings,
      ratingsAverage: stats[0].avgRating,
    });
  }
};

reviewSchema.post("save", async function () {
  this.constructor.calcAverageRatings(this.company);
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;
