import Service from "../models/serviceModel.js";
import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

export const createService = catchAsync(async (req, res, next) => {
  const service = await Service.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
});

export const getAllServices = catchAsync(async (req, res, next) => {
  const services = await Service.find();

  res.status(200).json({
    status: "success",
    result: services.length,
    data: {
      services,
    },
  });

  next();
});

export const getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError("No Document found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
});

export const updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });

  if (!service) {
    return next(new AppError("No Document found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
});

export const deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, {
    serviceStatus: false,
  });

  if (!service) {
    return next(new AppError("No Document found by this ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
});
