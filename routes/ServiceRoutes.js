import express from "express";
import {
  createService,
  getAllServices,
  getService,
  updateService,
  deleteService,
} from "./../controllers/serviceConrollers.js";

const router = express.Router();

router.route("/").post(createService).get(getAllServices);
router.route("/:id").get(getService).patch(updateService);

router.route("/deleteService/:id").patch(deleteService);

export default router;
