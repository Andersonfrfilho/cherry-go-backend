import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateDocumentsUsersController } from "@modules/accounts/useCases/createDocumentsUsers/CreateDocumentsUsers.controller";
import { schemaCreateDocumentsUsersClient } from "@modules/accounts/useCases/createDocumentsUsers/createDocumentsUsers.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const documentsRoutes = Router();
const createDocumentsUsersController = new CreateDocumentsUsersController();

const uploadDocument = multer(uploadConfig);

documentsRoutes.post(
  "/",
  uploadDocument.single("document"),
  ensureAuthenticated,
  // schemaCreateDocumentsUsersClient,
  createDocumentsUsersController.handle
);

export { documentsRoutes };
