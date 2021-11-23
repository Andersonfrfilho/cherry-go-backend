import { Router } from "express";

import { CreateBankAccountController } from "@modules/accounts/useCases/createBankAccount/CreateBankAccount.controller";
import { schemaCreateBankAccount } from "@modules/accounts/useCases/createBankAccount/createBankAccount.schema";
import { DeleteBankAccountController } from "@modules/accounts/useCases/deleteBankAccount/DeleteBankAccount.controller";
import { GetAllBanksController } from "@modules/banks/useCases/getAllBanks/GetAllBanks.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const banksRoutes = Router();

const getAllBanksController = new GetAllBanksController();
const createBankAccountController = new CreateBankAccountController();
const deleteBankAccountController = new DeleteBankAccountController();

banksRoutes.get("/", ensureAuthenticated, getAllBanksController.handle);
banksRoutes.post(
  "/",
  ensureAuthenticated,
  schemaCreateBankAccount,
  createBankAccountController.handle
);
banksRoutes.delete(
  "/",
  ensureAuthenticated,
  deleteBankAccountController.handle
);

export { banksRoutes };
