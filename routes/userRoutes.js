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
  getAllEmployee,
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

router.use(protect);

router.route("/updatepassword").post(updateMypassword);
router.route("/updateMe").post(updateMe);
router.route("/deleteMe").patch(deleteMe);
router.route("/me").get(me, getUser);

router.use(restrictTo("admin"));

router.route("/getAllEmployee").get(getAllEmployee);
router.route("/").post(restrictTo("admin"), createUser).get(getAllUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

export default router;
