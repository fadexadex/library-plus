import { AdminController } from "./controller";
import { Router } from "express";
import {
  authGuard,
  adminGuard,
  parseCopiesAndPrice,
  validateFile,
} from "../../middlewares";
import { GeneralController } from "../../modules/general/controller";
import { uploadCSV, uploadImage } from "../../utils/multer";
import { BookValidator } from "../../middlewares";

const router = Router();

const adminController = new AdminController();
const generalController = new GeneralController();
const bookValidator = new BookValidator();

router.use(authGuard, adminGuard);

router.post(
  "/books/create",
  uploadImage.single("cover"),
  parseCopiesAndPrice,
  bookValidator.validateCreateBookBody,
  validateFile,
  adminController.createBook
);
router.post(
  "/books/batch-create",
  uploadCSV.single("file"),
  validateFile,
  adminController.batchCreateBooks
);

router.get("/books", generalController.getAllBooks);
router.get("/books/:id", bookValidator.validateId, generalController.getBookById);

router.get(
  "/borrow-requests",
  bookValidator.validateStatusQuery,
  adminController.getBorrowRequests
);
router.get(
  "/borrow-requests/:id",
  bookValidator.validateId,
  adminController.getBorrowRequest
);
router.patch(
  "/borrow-requests/:id/status",
  bookValidator.validateId,
  bookValidator.validateStatusBody,
  adminController.updateBorrowRequestStatus
);

router.get("/notifications", generalController.getNotifications);

router.get("/activities", adminController.getAllActivities);

export default router;
