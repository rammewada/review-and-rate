import Company from "../models/companyModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createCompany = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Company logo is required", 400));
  }

  const filename = req.file.path;
  req.body.logo = filename;

  req.body.foundedYear = new Date(req.body.foundedYear);

  const company = await Company.create(req.body);

  console.log("Company created successfully:", company);

  res.status(201).json({
    status: "success",
    data: {
      company,
    },
  });
});

export const getAllCompanies = catchAsync(async (req, res, next) => {
  const {
    search,
    sort = "createdAt",
    order = "desc",
    page = 1,
    limit = 20,
    city,
    minRating,
    topRated,
  } = req.query;

  const filter = {};

  if (search && search.trim()) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { address: { $regex: search, $options: "i" } },
      { city: { $regex: search, $options: "i" } },
    ];
  }

  if (city) {
    filter.city = city;
  }

  if (minRating) {
    filter.ratingsAverage = { $gte: Number(minRating) };
  }

  let sortOptions = {};
  if (sort === "ratingsAverage" || topRated === "true") {
    sortOptions = { ratingsAverage: -1 };
  } else if (city) {
    sortOptions = { name: 1 };
  } else {
    sortOptions[sort] = order === "asc" ? 1 : -1;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const companies = await Company.find(filter)
    .sort(sortOptions)
    .skip(skip)
    .limit(Number(limit))
    .select("-__v");

  const total = await Company.countDocuments(filter);

  res.status(200).json({
    status: "success",
    page: Number(page),
    limit: Number(limit),
    total,
    results: companies.length,
    data: { companies },
  });
});

export const getCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findById(req.params.id).populate("reviews");
  if (!company) {
    return next(new AppError("Company not found", 404));
  }

  return res.status(200).json({
    status: "sucess",
    data: {
      company,
    },
  });
});

export const deleteCompany = catchAsync(async (req, res, next) => {
  const company = await Company.findByIdAndDelete(req.params.id);

  if (!company) {
    return next(new AppError("Company not found", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      company,
    },
  });
});
