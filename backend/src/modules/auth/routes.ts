import { Router } from "express";
import { AuthController } from "./controller";
import { AuthValidator } from "../../middlewares";
import { authGuard } from "../../middlewares";

const authController = new AuthController();
const authValidator = new AuthValidator();
const router = Router();

router.post(
  "/register",
  authValidator.validateRegisterBody,
  authController.register
);
router.post("/login", authController.login);
router.post("/admin/login", authController.adminLogin);

router.get("/me", authGuard, authController.getMe);

export default router;
