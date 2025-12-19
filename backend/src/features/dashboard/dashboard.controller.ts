import { Request, Response } from "express";
import { SendResponse } from "../../shared/utils/JsonResponse";
import { getDashboardStatsService } from "./dashboard.service";

export const getDashboardStats = async (req: Request, res: Response) => {
  const dashboardStats = await getDashboardStatsService();
  SendResponse(res, {
    data: dashboardStats,
    message: "fetch dashboard stats",
    status_code: 200,
  });
};
    