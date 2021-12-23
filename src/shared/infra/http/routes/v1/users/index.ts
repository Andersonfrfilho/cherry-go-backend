import { Router } from "express";

import { GetUsersController } from "@modules/accounts/useCases/getUsers/GetUsers.controller";
import { ShowUsersController } from "@modules/accounts/useCases/showUser/ShowUser.controller";
import { UpdateUserController } from "@modules/accounts/useCases/updateUser/UpdateUser.controller";
import { authenticateUsersRoutes } from "@shared/infra/http/routes/v1/users/authenticate.routes";
import { clientsRoutes } from "@shared/infra/http/routes/v1/users/clients.routes";
import { confirmsRoutes } from "@shared/infra/http/routes/v1/users/confirms.routes";
import { documentsRoutes } from "@shared/infra/http/routes/v1/users/documents.routes";
import { insidesRoutes } from "@shared/infra/http/routes/v1/users/inside.routes";
import { passwordRoutes } from "@shared/infra/http/routes/v1/users/password.routes";
import { profileRoutes } from "@shared/infra/http/routes/v1/users/profile.routes";
import { providersRoutes } from "@shared/infra/http/routes/v1/users/providers.routes";

import { addressesRoutes } from "./addresses.routes";
import { banksRoutes } from "./banks.routes";
import { localsRoutes } from "./locals.routes";
import { tariffsRoutes } from "./tariffs.routes";
import { transportsRoutes } from "./transports.routes";

const usersRoutes = Router();
const getUsersController = new GetUsersController();
const showUsersController = new ShowUsersController();
const updateUserController = new UpdateUserController();

usersRoutes.get("/", getUsersController.handle);
usersRoutes.use("/banks", banksRoutes);
usersRoutes.use("/transports", transportsRoutes);
usersRoutes.use("/tariffs", tariffsRoutes);
usersRoutes.use("/addresses", addressesRoutes);
usersRoutes.use("/locals", localsRoutes);
usersRoutes.get("/:id", showUsersController.handle);
usersRoutes.put("/", updateUserController.handle);
usersRoutes.use("/clients", clientsRoutes);
usersRoutes.use("/insides", insidesRoutes);
usersRoutes.use("/providers", providersRoutes);
usersRoutes.use("/password", passwordRoutes);
usersRoutes.use("/confirm", confirmsRoutes);
usersRoutes.use("/documents", documentsRoutes);
usersRoutes.use("/profiles", profileRoutes);
usersRoutes.use(authenticateUsersRoutes);

export { usersRoutes };
