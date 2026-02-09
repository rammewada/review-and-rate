import Company from "../models/companyModel.js";

export const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);
    console.log(company);
    res.status(201).json({
      status: "success",
      data: {
        company,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find().populate("reviews");
    res.status(200).json({
      status: "success",
      data: { companies },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
