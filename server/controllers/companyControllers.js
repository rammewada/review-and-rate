import Company from "../models/companyModel.js";

export const createCompany = async (req, res, next) => {
  try {
    const company = await Company.create(req.body);
    console.log(company);
    res.status(201).json({
      status: "success",
      data: {
        company,
      },
    });
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
