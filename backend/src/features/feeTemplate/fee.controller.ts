import { Request, Response } from "express";

import { SendResponse } from "../../shared/utils/JsonResponse";
import {
  createFeeInvoiceService,
  createFeeTemplateService,
  createInvoicePaymentService,
  feeReportService,
  singleStudentFeeSummaryService,
} from "./fee.service";

export const createFeeTemplate = async (req: Request, res: Response) => {
  const feeTemplate = await createFeeTemplateService(req.body);
  SendResponse(res, {
    data: feeTemplate,
    message: "created Fee template !",
    status_code: 201,
  });
};

export const createFeeInvoice = async (req: Request, res: Response) => {
  const feeInvoice = await createFeeInvoiceService(req.params.id, req.body);
  SendResponse(res, {
    data: feeInvoice,
    message: "created Fee Invoice !",
    status_code: 201,
  });
};

export const createInvoicePayment = async (req: Request, res: Response) => {
  const feeInvoice = await createInvoicePaymentService(req.params.id,req.body);
  SendResponse(res, {
    data: feeInvoice,
    message: "created Fee Invoice !",
    status_code: 201,
  });
};

export const fetchAllfeeReports = async (req: Request, res: Response) => {
  const feeReports = await feeReportService();
  SendResponse(res, {
    data: feeReports,
    message: "fetch Fee reports !",
    status_code: 200,
  });
};

export const fetchStudentFeeSummary = async (req: Request, res: Response) => {
  const feeSummary = await singleStudentFeeSummaryService(req.params.id);
  SendResponse(res, {
    data: feeSummary,
    message: "fetch Fee summary !",
    status_code: 200,
  });
};
