import { Router } from "express";

import { usersRoutes } from "@shared/infra/http/routes/v1/users";

const v1 = Router();

v1.use("/users", usersRoutes);

export { v1 };
