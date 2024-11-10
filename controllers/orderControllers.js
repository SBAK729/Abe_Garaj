import Order from "../models/orderModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const orderControllers = {
  createOrder: catchAsync(async (req, res, next) => {
    const order = await Order.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });

    next();
  }),

  getAllOrders: catchAsync(async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
      status: "success",
      result: orders.length,
      data: {
        orders,
      },
    });
  }),

  getOrder: catchAsync(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return next(new AppError("No Document found by this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });

    next();
  }),

  updateOrder: catchAsync(async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $push: { order_services: req.body.order_services } },
      {
        new: true,
        runValidator: true,
      }
    );

    if (!order) {
      return next(new AppError("No Document found by this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  }),

  onProgress: catchAsync(async (req, res, next) => {
    const change = await Order.findByIdAndUpdate(
      req.params.id,
      {
        order_status: "onProgress",
      },
      { new: true, runValidators: true }
    );

    if (!change) {
      return next(new AppError("No Document found by this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        change,
      },
    });
  }),

  completed: catchAsync(async (req, res, next) => {
    const change = await Order.findByIdAndUpdate(
      req.params.id,
      {
        order_status: "completed",
        completed_at: Date.now(),
      },
      { new: true, runValidators: true }
    );

    if (!change) {
      return next(new AppError("No Document found by this ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        change,
      },
    });
  }),

  getOrdersOnProgress: catchAsync(async (req, res, next) => {
    const onProgress = await Order.find({ order_status: "onProgress" });

    res.status(200).json({
      status: "success",
      result: onProgress.length,
      data: {
        onProgress,
      },
    });
  }),

  getCompletedOrders: catchAsync(async (req, res, next) => {
    const completed = await Order.find({ order_status: "completed" });

    res.status(200).json({
      status: "success",
      result: completed.length,
      data: {
        completed,
      },
    });
  }),
};

export default orderControllers;
