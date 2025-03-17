import { UserController } from "./controller";
import { Router } from "express";
import { authGuard } from "../../middlewares";
import { GeneralController } from "../../modules/general/controller";
import { BookValidator } from "../../middlewares";

const router = Router();

const userController = new UserController();
const generalController = new GeneralController();
const bookValidator = new BookValidator();

router.use(authGuard);

router.get("/books", generalController.getAllBooks);
router.get(
  "/books/:id",
  bookValidator.validateId,
  generalController.getBookById
);

router.post(
  "/books/:id/borrow",
  bookValidator.validateId,
  userController.borrowBook
);

router.get("/borrow-requests", userController.getBorrowRequests);
router.get(
  "/borrow-requests/:id",
  bookValidator.validateId,
  userController.getBorrowRequest
);

router.post("/books/:id/return", bookValidator.validateId, userController.submitReturnRequest);

router.get("/notifications", generalController.getNotifications);

router.get("/activities", userController.getUserActivities);

export default router;
