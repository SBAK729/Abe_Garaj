import crypto from "crypto";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import nodeMailer from "nodemailer";

import AppError from "../utils/appError.js";
import { catchAsync } from "../utils/catchAsync.js";

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const signUp = catchAsync(async (req, res, next) => {
  let user = await User.create({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
    phone_number: req.body.phone_number,
    password: req.body.password,
    password_confirm: req.body.password_confirm,
    role: req.body.role,
  });

  const token = createToken(user._id);

  user.password = undefined;

  res.status(200).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!!", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(
      new AppError(
        "Incorrect Email or Password, please Provide correct one.",
        401
      )
    );
  }

  const token = createToken(user._id);

  res.status(200).json({
    status: "success",
    message: "successfully logged in!!",
    token,
  });

  next();
});

export const protect = catchAsync(async (req, res, next) => {
  //1) check if the token is exist and valid
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("You are not loged in, login to access!", 401));
  }
  //2) verification token
  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET_KEY);
  //3) check if user still exists

  const user = await User.findOne({ _id: decode.id });

  if (!user) {
    return next(
      new AppError("The user belonging to this token does not exist.", 401)
    );
  }

  //4) check if user changed password after token was issued
  if (user.passwordChangedAfter(decode.iat)) {
    return next(
      new AppError(
        "The password is recently changed, please log in again!",
        401
      )
    );
  }
  // GRANT ACCESS TO PROTECTED ROUTE

  req.user = user;

  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this activity!",
          401
        )
      );
    }

    next();
  };
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  // Find the user based on email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError("There is no user with this email address!", 404));
  }

  // Generate the reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    // Construct the reset URL
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetpassword/${resetToken}`;

    const message = `Forgot your password? Send a patch request to reset your password to: ${resetUrl}. If you did not forget your password, ignore this email.`;

    // Configure the email transporter
    const transporter = nodeMailer.createTransport({
      service: "gmail", // Ensure "service" is correctly spelled
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    // console.log(user.email);
    // Email options
    const mailOption = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      text: message,
    };

    // Send the email
    await transporter.sendMail(mailOption);

    // Respond with success message
    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
      resetToken,
    });
  } catch (err) {
    // Handle errors during email sending
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    console.log(err);
    return next(
      new AppError(
        "There is an error sending the email!, please try again latar!",
        500
      )
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: resetToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) {
    return next(
      new AppError("This token is invalid or expired, please try again!", 400)
    );
  }

  user.password = req.body.password;
  user.password_confirm = req.body.password_confirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  const token = createToken(user.id);

  res.status(200).json({
    status: "success",
    message: "password is successfully reset",
    token,
  });

  next();
});

export const updateMypassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ _id: req.user._id }).select("+password");
  if (!(await user.correctPassword(req.body.current_password, user.password))) {
    return next(new AppError("Your current password is not correct!", 401));
  }

  user.password = req.body.new_password;
  user.password_confirm = req.body.new_password_confirm;

  await user.save();

  const token = createToken(user.id);

  res.status(200).json({
    status: "success",
    message: "Password changed successfully",
    token,
  });

  next();
});
