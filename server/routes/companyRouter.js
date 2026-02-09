import express from "express";
import { createCompany } from "../controllers/companyControllers.js";

const router = express.Router();

router.post("/", createCompany);

export default router;
