import express, { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateDocumentsUsersController } from "@modules/accounts/useCases/createDocumentsUsers/CreateDocumentsUsers.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const documentsRoutes = Router();
const createDocumentsUsersController = new CreateDocumentsUsersController();

const uploadDocument = multer(uploadConfig);
// "route_path", "file_path"
documentsRoutes.use(
  "/image/view",
  express.static(`${uploadConfig.tmpFolder}/documents`)
);

documentsRoutes.post(
  "/image",
  uploadDocument.single("document"),
  // ensureAuthenticated,
  createDocumentsUsersController.handle
);

export { documentsRoutes };
