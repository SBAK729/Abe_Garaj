import express from "express";
import vehicleControllers from "./../controllers/vehicleControllers.js";
import { protect, restrictTo } from "./../controllers/authControllers.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(restrictTo("admin"), vehicleControllers.createVehicle)
  .get(restrictTo("admin"), vehicleControllers.getAllVehicles);

router
  .route("/:customer")
  .get(restrictTo("admin"), vehicleControllers.getVehiclePerCustomer);

router
  .route("/:id")
  .get(restrictTo("admin"), vehicleControllers.getVehicle)
  .patch(restrictTo("admin", "employee"), vehicleControllers.updateVehicle)
  .delete(restrictTo("admin", "employee"), vehicleControllers.changeOwnership);

export default router;
