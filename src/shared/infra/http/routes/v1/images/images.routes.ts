import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateTransportController } from "@modules/images/useCases/createImage/CreateImage.controller";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const imagesRoutes = Router();
const uploadDocument = multer(uploadConfig);
const createTransportController = new CreateTransportController();

imagesRoutes.post(
  "/",
  ensureAuthenticated,
  uploadDocument.single("image"),
  createTransportController.handle
);

export { imagesRoutes };
