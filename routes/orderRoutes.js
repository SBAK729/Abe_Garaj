import express from "express";
import orderControllers from "./../controllers/orderControllers.js";
import { protect, restrictTo } from "../controllers/authControllers.js";

const router = express.Router();

router.use(protect, restrictTo("admin ", "employee"));

router
  .route("/")
  .post(orderControllers.createOrder)
  .get(orderControllers.getAllOrders);

router
  .route("/o/:id")
  .get(orderControllers.getOrder)
  .patch(orderControllers.updateOrder);

router.route("/changeToOnProgress/o/:id").patch(orderControllers.onProgress);
router.route("/changeToCompleted/o/:id").patch(orderControllers.completed);

router.route("/ordersOnProgress").get(orderControllers.getOrdersOnProgress);
router.route("/completedOrders").get(orderControllers.getCompletedOrders);

export default router;
