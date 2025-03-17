import express from "express";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares";
import authRoutes from "./modules/auth/routes";
import adminRoutes from "./modules/admin/routes";
import userRoutes from "./modules/user/routes";
import genenralRoutes from "./modules/general/routes";
import cors from "cors"


dotenv.config();

export class Server {
  private app: express.Application;
  private port: number;
  private apiRouter: express.Router;

  constructor(port: number) {
    this.port = port;
    this.app = express();
    this.apiRouter = express.Router();
  }

  private enableMiddlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cors());
    this.app.use(errorHandler); 
  }

  private setUpRoutes() {
    this.apiRouter.use("/auth", authRoutes);
    this.apiRouter.use("/user", userRoutes);
    this.apiRouter.use("/general", genenralRoutes);
    this.apiRouter.use("/admin", adminRoutes);
    this.app.use("/api/v1", this.apiRouter);
    this.app.use(errorHandler);
  }

  public startApp() {
    this.enableMiddlewares();
    this.setUpRoutes();
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
