import { Router } from "express";
import { ReportsController } from "../controllers/reportController";

const router = Router();

router.get("/", ReportsController.getReports);

export default router;