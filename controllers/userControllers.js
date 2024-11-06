import User from "./../models/userModel.js";
import APIFeatures from "./../utils/apiFeatures.js";

export const createUser = async (req, res, next) => {
  const newUser = await User.create(req.body);

  res.status(200).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
};

export const getAllUsers = async (req, res, next) => {
  let features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .pagnation();

  const users = await features.query;

  res.status(200).json({
    status: "success",
    data: {
      result: users.length,
      users: users,
    },
  });
};

export const getUser = async (req, res, next) => {
  const user = await User.findOne({ _id: req.params.id });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "No user found by this id",
    });
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });

  next();
};

export const updateUser = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });

  next();
};

export const deleteUser = async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "deleted",
    data: null,
  });

  next();
};

export const updateMe = async (req, res, next) => {
  if (req.body.password || req.body.password_confirm) {
    return res.status(400).json({
      status: "fail",
      message:
        "This route is not for updatting password, use updatepassword route!",
    });
  }

  // Filtered out unwanted fields names not to be updated.
  const filterBody = filterObj(
    req.body,
    "first_name",
    "last_name",
    "email",
    "phone_number"
  );

  // 2) update the user's data

  const user = await User.findByIdAndUpdate(req.params.id, filterBody, {
    new: true,
    runValidator: true,
  });

  res.status(200).json({
    status: "success",
    user: {
      user,
    },
  });
  next();
};

export const deleteMe = async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: "success",
    data: null,
  });

  next();
};

export const me = async (req, res, next) => {
  req.params.id = req.user._id;

  next();
};

export const getAllEmployee = async (req, res, next) => {
  const employee = await User.find({ role: "employee" });

  res.status(200).json({
    status: "success",
    result: employee.length,
    data: {
      employee,
    },
  });
};
