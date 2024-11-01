import Service from "../models/serviceModel.js";

export const createService = async (req, res, next) => {
  const service = await Service.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
};

export const getAllServices = async (req, res, next) => {
  const services = await Service.find();

  res.status(200).json({
    status: "success",
    result: services.length,
    data: {
      services,
    },
  });

  next();
};

export const getService = async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
};

export const updateService = async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
};

export const deleteService = async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, {
    serviceStatus: false,
  });

  res.status(200).json({
    status: "success",
    data: {
      service,
    },
  });

  next();
};
