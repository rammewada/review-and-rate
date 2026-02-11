import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  createCompany,
  deleteCompany,
  getAllCompanies,
  getCompany,
} from "../controllers/companyControllers.js";
import AppError from "../utils/appError.js";

const router = express.Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.fieldname === "logo") {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new AppError("Only image files are allowed", 400));
    }
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1 * 1024 * 1024,
  },
});

router
  .route("/")
  .post(upload.single("logo"), createCompany)
  .get(getAllCompanies);

router.route("/:id").get(getCompany).delete(deleteCompany);

export default router;
