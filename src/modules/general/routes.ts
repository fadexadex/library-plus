import { Router } from "express";
import { authGuard } from "../../middlewares";
import { GeneralController } from "../../modules/general/controller";
import { BookValidator } from "../../middlewares";

const router = Router();

const generalController = new GeneralController();
const bookValidator = new BookValidator();

router.get("/books", generalController.getAllBooks);
router.get(
  "/books/:id",
  bookValidator.validateId,
  generalController.getBookById
);

router.get("/search", generalController.searchBooks);

router.post(
  "/purchase/initiate",
  authGuard,
  bookValidator.validateBookPurchaseBody,
  generalController.initiateBookPurchase
);

router.post("/webhook",generalController.handleWebhook )

router.get("/notifications", authGuard, generalController.getNotifications);

export default router;
