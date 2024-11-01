import crypto from "crypto";
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: [true, "The user must have first name!"],
  },
  last_name: {
    type: String,
    required: [true, "The user must have last name!"],
  },
  email: {
    type: String,
    required: [true, "The user must have email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, " Please Provide a valid email "],
  },
  phone_number: {
    type: Number,
    required: [true, "The user must have phone number"],
    validate: {
      validator: function (v) {
        return /^9\d{8}$/.test(v.toString());
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
  },
  password: {
    type: String,
    required: [true, "The user must have password!"],
    select: false,
  },
  password_confirm: {
    type: String,
    required: [true, "The user must confirm password!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same try again!!",
    },
  },
  role: {
    type: String,
    // enum: ["admin", "employee", "customer"],
    // default: "customer",
  },
  registered_at: {
    type: Date,
    default: Date.now,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  password_changed_at: Date,
  active: {
    type: Boolean,
    default: true,
  },
});

userSchema.pre("save", async function (next) {
  // only run when password is modified
  if (!this.isModified("password")) return next();

  // hashing password with cost function of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete the passwordConfirm field
  this.password_confirm = undefined;
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.password_changed_at = Date.now() - 1000;
  next();
});
userSchema.methods.passwordChangedAfter = function (JWTTimeStamp) {
  if (this.password_changed_at) {
    const changedTimeStamp = parseInt(
      this.password_changed_at.getTime() / 1000,
      10
    );

    return JWTTimeStamp < changedTimeStamp;
  }
  return false;
};

userSchema.methods.correctPassword = async function (
  currentPassword,
  candidatePassword
) {
  return bcrypt.compare(currentPassword, candidatePassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
