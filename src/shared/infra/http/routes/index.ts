import { Router } from "express";

import { authenticateUsersRoutes } from "@shared/infra/http/routes/authenticate.routes";
import { passwordRoutes } from "@shared/infra/http/routes/password.routes";
// import { usersRoutes } from "@shared/infra/http/routes/users.routes";
import { clientsRoutes } from "@shared/infra/http/routes/users/clients.routes";

const router = Router();

// router.use("/users", usersRoutes);
router.use("/users/clients", clientsRoutes);
router.use("/password", passwordRoutes);
router.use(authenticateUsersRoutes);

export { router };
