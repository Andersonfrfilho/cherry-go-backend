import { Router } from "express";

import { docs } from "@shared/docs";
import { healthcheck } from "@shared/infra/http/routes/healthcheck";
import { v1 } from "@shared/infra/http/routes/v1";

const router = Router();

router.use(healthcheck);
router.use("/v1", v1);
router.use("/docs", docs);
export { router };
