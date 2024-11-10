import express from "express";
import {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
} from "../controllers/serviceConrollers.js";
import { protect, restrictTo } from "../controllers/authControllers.js";

const router = express.Router();

router.use(protect, restrictTo("admin"));

router.route("/").post(createService).get(getAllServices);
router.route("/:id").get(getService).patch(updateService);

router.route("/deleteService/:id").patch(deleteService);

export default router;
