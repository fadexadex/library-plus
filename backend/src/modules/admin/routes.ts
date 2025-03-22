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
import { AdminValidator } from "../../middlewares/validators/admin/validators";

const router = Router();

const adminController = new AdminController();
const generalController = new GeneralController();
const bookValidator = new BookValidator();
const adminValidator = new AdminValidator();

router.use(authGuard, adminGuard);

router.post("/ask-ai",adminValidator.validateChatQuery, adminController.askAI);

router.post(
  "/books/create",
  uploadImage.single("cover"),
  parseCopiesAndPrice,
  bookValidator.validateCreateBookBody,
  validateFile,
  adminController.createBook
);


router.patch(
  "/books/:id",
  uploadImage.single("cover"),
  parseCopiesAndPrice,
  bookValidator.validateId,
  bookValidator.validateUpdateBookBody,
  adminController.updateBook
)

router.delete("/books/:id", bookValidator.validateId, adminController.deleteBook);

router.post(
  "/books/batch-create",
  uploadCSV.single("file"),
  validateFile,
  adminController.batchCreateBooks
);



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

router.get("/purchases", adminController.getAllPurchases);


router.get("/user/count", adminController.getUserCount);


export default router;
