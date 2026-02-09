import express from "express";
import {
  createCompany,
  getAllCompanies,
} from "../controllers/companyControllers.js";

const router = express.Router();

router.route("/")
      .post(createCompany)
      .get(getAllCompanies);

export default router;
