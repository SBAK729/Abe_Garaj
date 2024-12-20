import Vehicle from "../models/vehicleModel.js";
import User from "../models/userModel.js";
import APIFeatures from "../utils/apiFeatures.js";

import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const vehicleControllers = {
  createVehicle: catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });

    next();
  }),

  getAllVehicles: catchAsync(async (req, res, next) => {
    const Features = new APIFeatures(Vehicle.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .pagnation();
    const vehicles = await Features.query.populate(
      "customer",
      "-_id first_name last_name email"
    );

    res.status(200).json({
      status: "success",
      result: vehicles.length,
      data: {
        vehicles,
      },
    });

    next();
  }),

  getVehicle: catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "customer",
      "-_id first_name last_name email"
    );

    if (!vehicle) {
      return next(new AppError("No Document found by this ID!", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });

    next();
  }),

  updateVehicle: catchAsync(async (req, res, next) => {
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      {
        vehicle_tag: req.body.vehicle_tag,
        vehicle_color: req.body.vehicle_color,
      },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return next(new AppError("No Document found by this ID!", 400));
    }

    res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });

    next();
  }),

  changeOwnership: catchAsync(async (req, res, next) => {
    const user = await User.findById(req.body.customer);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        messege: "The user with this id not found or inactive!!!",
      });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { customer: req.body.customer },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: "success",
      data: {
        vehicle,
      },
    });
  }),

  getVehiclePerCustomer: catchAsync(async (req, res, next) => {
    const vehicles = await Vehicle.find({ customer: req.params.customer });

    res.status(200).json({
      status: "success",
      result: vehicles.length,
      data: {
        vehicles,
      },
    });
  }),
};

export default vehicleControllers;
