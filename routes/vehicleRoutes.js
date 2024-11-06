import express from "express";
import vehicleControllers from "./../controllers/vehicleControllers.js";

const router = express.Router();

router
  .route("/")
  .post(vehicleControllers.createVehicle)
  .get(vehicleControllers.getAllVehicles);

router.route("/:customer").get(vehicleControllers.getVehiclePerCustomer);

router
  .route("/:id")
  .get(vehicleControllers.getVehicle)
  .patch(vehicleControllers.updateVehicle)
  .delete(vehicleControllers.changeOwnership);

export default router;
