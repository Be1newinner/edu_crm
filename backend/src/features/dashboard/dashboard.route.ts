import { Router } from "express";
import { getDashboardStats } from "./dashboard.controller";
export const dashboardRouter:Router=Router()

dashboardRouter.get("/stats",getDashboardStats)
