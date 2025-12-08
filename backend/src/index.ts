import "dotenv/config";
import "reflect-metadata";

import express, { type Express } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import { connectDB } from "./shared/config/db";
import { setupSwagger } from "./shared/config/swagger";
// import { streamToElastic } from "./shared/utils/logger";
// import { oauthMiddleware } from "./features/auth/oauthMiddleware";
import { loggerMiddleware } from "./shared/middlewares/logger.middleware";
import RequestLogger from "./shared/middlewares/request_logger.middleware";
import { errorHandler } from "./shared/middlewares/error.middleware";

import { AuthRouter } from "./features/auth/auth.route";
import { imagesRouter } from "./features/uploads/upload.route";
import { UsersRouter } from "./features/users/user.route";
import { instituteRouter } from "./features/institute/institute.route";
import { roleRouter } from "./features/roles/role.route";
import { batchRouter } from "./features/batch/batch.route";
import { courseRouter } from "./features/courses/course.route";
import { staffRouter } from "./features/staff/staff.route";
import { FeeTemplateRouter } from "./features/feeTemplate/fee.route";
import { StudentRouter } from "./features/students/students.route";

const WHITELIST_DOMAINS = process.env.CORS_WHITELIST?.split(",");

const app: Express = express();
const PORT = process.env.PORT || 8000;

const limiter = rateLimit({
  windowMs: 15 * 60_1000,
  max: process.env.NODE_ENV === "development" ? Infinity : 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// all the middlewares
app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: WHITELIST_DOMAINS,
    credentials: true,
  })
);
app.use(RequestLogger);
app.use(loggerMiddleware);
setupSwagger(app);


// app.get(
//   "/",
//   oauthMiddleware,
//   function (_: express.Request, res: express.Response) {
//     res.send({ message: "Welcome to Wingfi Apis!" });
//   }
// );

app.use("/auth", AuthRouter);
app.use("/users", UsersRouter);
app.use("/images", imagesRouter);
app.use("/institute", instituteRouter);
app.use("/roles", roleRouter);
app.use("/batches", batchRouter);
app.use("/courses",courseRouter);
app.use("/staff",staffRouter);
app.use("/fee-templates",FeeTemplateRouter);
app.use("/students", StudentRouter);

// do not touch this! as error middleware will be in the end of all the routes!
app.use(errorHandler);

let server;

async function startServer() {
  try {
    await connectDB();
    server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    // streamToElastic._flush((error) => {
    //   console.log(error);
    // });
    process.exit(1);
  }
}

if (import.meta.url === new URL(import.meta.url, import.meta.url).href) {
  startServer();
}

export { app, startServer, server };
