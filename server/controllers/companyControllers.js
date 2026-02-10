import Company from "../models/companyModel.js";

export const createCompany = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        status: "fail",
        message: "Company logo is required",
      });
    }
    const filename = req.file.path;
    req.body.logo = filename;

    const company = await Company.create(req.body);

    console.log("Company created successfully:", company);

    res.status(201).json({
      status: "success",
      data: {
        company,
      },
    });
  } catch (error) {
    console.log("Error creating company:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        status: "fail",
        message: "Validation error",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        status: "fail",
        message: "Company with this name already exists",
      });
    }

    res.status(500).json({
      status: "error",
      message: "Server error",
      error: error.message,
    });
  }
};
export const getAllCompanies = async (req, res) => {
  try {
    const {
      search,
      sort = "createdAt",
      order = "desc",
      page = 1,
      limit = 10,
      city,
      minRating,
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

    const sortOptions = {};
    sortOptions[sort] = order === "asc" ? 1 : -1;

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
  } catch (error) {
    console.error("getAllCompanies error:", error);
    res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

export const getCompany = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate("reviews");
    if (!company) {
      return res.status(404).json({
        status: "fail",
        message: "Company not found",
      });
    }

    return res.status(200).json({
      status: "sucess",
      data: {
        company,
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ status: "error", message: "Server error", error: error.message });
  }
};
