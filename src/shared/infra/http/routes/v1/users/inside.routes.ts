import { Router } from "express";

import { ConfirmPhonesUserInsideController } from "@modules/accounts/useCases/confirmAccountPhoneUserInside/ConfirmPhonesUserInside.controller";
import { schemaConfirmPhonesUserInside } from "@modules/accounts/useCases/confirmAccountPhoneUserInside/confirmPhonesUserInside.schema";
import { CreateAddressUserInsideController } from "@modules/accounts/useCases/createAddressUserInside/CreateAddressUserInside.controller";
import { schemaCreateAddressUserInside } from "@modules/accounts/useCases/createAddressUserInside/createAddressUserInside.schema";
import { CreatePhonesUserInsideController } from "@modules/accounts/useCases/createPhonesUserInside/CreatePhonesUserInside.controller";
import { schemaCreatePhonesUserInside } from "@modules/accounts/useCases/createPhonesUserInside/createPhonesUserInside.schema";
import { CreateUserInsideController } from "@modules/accounts/useCases/createUserInside/CreateUserInside.controller";
import { schemaCreateUserInside } from "@modules/accounts/useCases/createUserInside/createUserInside.schema";
import { CreateUsersTypeInsideController } from "@modules/accounts/useCases/createUsersTypeInside/CreateUsersTypeInside.controller";
import { schemaUsersTypeInsideUser } from "@modules/accounts/useCases/createUsersTypeInside/createUsersTypeInside.schema";

const insidesRoutes = Router();
const createUsersTypeInsideController = new CreateUsersTypeInsideController();
const createUserInsideController = new CreateUserInsideController();
const createAddressUserInsideController = new CreateAddressUserInsideController();
const createPhonesUserInsideController = new CreatePhonesUserInsideController();
const confirmPhonesUserInsideController = new ConfirmPhonesUserInsideController();

insidesRoutes.post(
  "/",
  schemaCreateUserInside,
  createUserInsideController.handle
);

insidesRoutes.post(
  "/addresses",
  schemaCreateAddressUserInside,
  createAddressUserInsideController.handle
);

insidesRoutes.post(
  "/phones",
  schemaCreatePhonesUserInside,
  createPhonesUserInsideController.handle
);

insidesRoutes.post(
  "/phones/confirm",
  schemaConfirmPhonesUserInside,
  confirmPhonesUserInsideController.handle
);

insidesRoutes.patch(
  "/",
  schemaUsersTypeInsideUser,
  createUsersTypeInsideController.handle
);

export { insidesRoutes };
