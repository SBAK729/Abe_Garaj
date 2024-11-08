import Order from "../models/orderModel.js";
import User from "../models/userModel.js";
import Vehicle from "../models/vehicleModel.js";
import Service from "../models/serviceModel.js";

const orderControllers = {
  createOrder: async (req, res, next) => {
    const order = await Order.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });

    next();
  },

  getAllOrders: async (req, res, next) => {
    const orders = await Order.find();

    res.status(200).json({
      status: "success",
      result: orders.length,
      data: {
        orders,
      },
    });
  },

  getOrder: async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });

    next();
  },

  updateOrder: async (req, res, next) => {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $push: { order_services: req.body.order_services } },
      {
        new: true,
        runValidator: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        order,
      },
    });
  },

  onProgress: async (req, res, next) => {
    const change = await Order.findByIdAndUpdate(
      req.params.id,
      {
        order_status: "onProgress",
      },
      { new: true, runValidators: true }
    );

    console.log(change);

    res.status(200).json({
      status: "success",
      data: {
        change,
      },
    });
  },

  completed: async (req, res, next) => {
    const change = await Order.findByIdAndUpdate(
      req.params.id,
      {
        order_status: "completed",
        completed_at: Date.now(),
      },
      { new: true, runValidators: true }
    );

    console.log(change);

    res.status(200).json({
      status: "success",
      data: {
        change,
      },
    });
  },

  getOrdersOnProgress: async (req, res, next) => {
    const onProgress = await Order.find({ order_status: "onProgress" });

    res.status(200).json({
      status: "success",
      result: onProgress.length,
      data: {
        onProgress,
      },
    });
  },

  getCompletedOrders: async (req, res, next) => {
    const completed = await Order.find({ order_status: "completed" });

    res.status(200).json({
      status: "success",
      result: completed.length,
      data: {
        completed,
      },
    });
  },
};

export default orderControllers;
