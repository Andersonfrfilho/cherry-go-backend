import { Router } from "express";

import { authenticateUsersRoutes } from "@shared/infra/http/routes/v1/users/authenticate.routes";
import { clientsRoutes } from "@shared/infra/http/routes/v1/users/clients.routes";
import { confirmsRoutes } from "@shared/infra/http/routes/v1/users/confirms.routes";
import { passwordRoutes } from "@shared/infra/http/routes/v1/users/password.routes";

const usersRoutes = Router();

usersRoutes.use("/clients", clientsRoutes);
usersRoutes.use("/password", passwordRoutes);
usersRoutes.use("/confirm", confirmsRoutes);
usersRoutes.use(authenticateUsersRoutes);

export { usersRoutes };
