import express from "express";
import { login, logout, register, updateProfile, saveJob, deleteAccount, deleteUserById } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { registrationUpload, profileUpdateUpload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(registrationUpload, register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated, profileUpdateUpload, updateProfile);
router.route("/profile/delete").delete(isAuthenticated, deleteAccount);
router.route("/save-job/:jobId").post(isAuthenticated, saveJob);
router.route("/admin/delete-user/:userId").delete(isAuthenticated, deleteUserById);

export default router;
