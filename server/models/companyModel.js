import mongoose from "mongoose";
import slugify from "slugify";

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Company name is required"],
      unique: true,
      maxLength: [100, "Company name must be less than 100 characters"],
      minLength: [3, "Company name must be at least 3 characters"],
      trim: true,
    },
    address: {
      type: String,
      required: [true, "Company address is required"],
      maxLength: [200, "Company address must be less than 200 characters"],
      minLength: [5, "Company address must be at least 5 characters"],
      trim: true,
    },
    foundedYear: {
      type: Number,
      required: [true, "Founded year is required"],
    },
    logo: {
      type: String,
      required: [true, "Company logo must have a Logo"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      maxLength: [50, "City name must be less than 50 characters"],
      minLength: [2, "City name must be at least 2 characters"],
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [0, "Average rating must be at least 0"],
      max: [5, "Average rating must be at most 5"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

companySchema.pre("save", async function () {
  this.slug = slugify(this.name, { lower: true });
});

companySchema.virtual("reviews", {
  ref: "Review",
  foreignField: "company",
  localField: "_id",
});

const Company = mongoose.model("Company", companySchema);

export default Company;
