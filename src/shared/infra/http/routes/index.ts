import { Router } from "express";

import { docs } from "@shared/docs";
import { v1 } from "@shared/infra/http/routes/v1";

const router = Router();

router.get("/check-health", (req, res) => res.json({ api: true }));
router.use("/v1", v1);
router.use("/docs", docs);
export { router };
