import { Router } from "express";

import { authenticateUsersRoutes } from "@shared/infra/http/routes/v1/authenticate.routes";
import { passwordRoutes } from "@shared/infra/http/routes/v1/password.routes";
import { clientsRoutes } from "@shared/infra/http/routes/v1/users/clients.routes";

const v1 = Router();

v1.use("/users/clients", clientsRoutes);
v1.use("/password", passwordRoutes);
v1.use(authenticateUsersRoutes);

export { v1 };
