import { Router } from "express";
import { VerifyAccessTokenMiddleWare } from "../../shared/middlewares/VerifyAccessToken";
import IsAdminMiddleware from "../../shared/middlewares/isAdmin.middleware";
import { requestValidateRequest } from "../../shared/middlewares/request_validate.middleware";
import { feeTemplateZodInputSchema } from "./fee.dto";
import { catchAsyncMiddleware } from "../../shared/middlewares/catchAsync.middleware";
import { createInvoicePayment, createFeeTemplate, createFeeInvoice, fetchAllfeeReports, fetchStudentFeeSummary } from "./fee.controller";

export const FeeTemplateRouter = Router();

FeeTemplateRouter.post(
  "/fee-templates",
  VerifyAccessTokenMiddleWare,
  IsAdminMiddleware,
  requestValidateRequest({ body: feeTemplateZodInputSchema }),
  catchAsyncMiddleware(createFeeTemplate,{
    message:"failed to create",
    status:500
  })
);
FeeTemplateRouter.post(
  "/students/:id/fee-invoice",
  catchAsyncMiddleware(createFeeInvoice,{
    message:"failed to create",
    status:500
  })
);
FeeTemplateRouter.post(
  "/invoices/:id/payments",
  catchAsyncMiddleware(createInvoicePayment,{
    message:"failed to create",
    status:500
  })
);
FeeTemplateRouter.get(
  "/report/fees",
  catchAsyncMiddleware(fetchAllfeeReports,{
    message:"failed to fetch",
    status:500
  })
);
FeeTemplateRouter.get(
  "/students/:id/fees",
  catchAsyncMiddleware(fetchStudentFeeSummary,{
    message:"failed to fetch",
    status:500
  })
);