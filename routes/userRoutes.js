import express from "express";
import {
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  me,
} from "./../controllers/userControllers.js";
import {
  login,
  signUp,
  protect,
  restrictTo,
  forgotPassword,
  resetPassword,
  updateMypassword,
} from "./../controllers/authControllers.js";

const router = express.Router();

router.route("/signup").post(signUp);
router.route("/login").post(login);
router.route("/forgotpassword").post(forgotPassword);
router.route("/resetpassword/:resetToken").post(resetPassword);

router.route("/updatepassword").post(protect, updateMypassword);

router.route("/updateMe").post(protect, updateMe);
router.route("/deleteMe").patch(protect, deleteMe);
router.route("/me").get(protect, me, getUser);

router.route("/").post(createUser).get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
