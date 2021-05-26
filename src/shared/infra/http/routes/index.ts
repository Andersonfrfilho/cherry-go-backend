import { Router } from "express";

import { v1 } from "@shared/infra/http/routes/v1";

const router = Router();

router.use("/v1", v1);

export { router };
