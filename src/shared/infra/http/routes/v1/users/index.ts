import { Router } from "express";

import { authenticateUsersRoutes } from "@shared/infra/http/routes/v1/users/authenticate.routes";
import { clientsRoutes } from "@shared/infra/http/routes/v1/users/clients.routes";
import { confirmsRoutes } from "@shared/infra/http/routes/v1/users/confirms.routes";
import { documentsRoutes } from "@shared/infra/http/routes/v1/users/documents.routes";
import { passwordRoutes } from "@shared/infra/http/routes/v1/users/password.routes";
import { profileRoutes } from "@shared/infra/http/routes/v1/users/profile.routes";
import { providersRoutes } from "@shared/infra/http/routes/v1/users/providers.routes";

const usersRoutes = Router();

usersRoutes.use("/clients", clientsRoutes);
usersRoutes.use("/providers", providersRoutes);
usersRoutes.use("/password", passwordRoutes);
usersRoutes.use("/confirm", confirmsRoutes);
usersRoutes.use("/documents", documentsRoutes);
usersRoutes.use("/profiles", profileRoutes);
usersRoutes.use(authenticateUsersRoutes);

export { usersRoutes };
