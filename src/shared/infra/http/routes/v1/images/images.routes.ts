import { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateImageController } from "@modules/images/useCases/createImage/CreateImage.controller";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";

const imagesRoutes = Router();
const uploadDocument = multer(uploadConfig);
const createImageController = new CreateImageController();

imagesRoutes.post(
  "/",
  ensureAuthenticatedInside,
  uploadDocument.single("image"),
  createImageController.handle
);

export { imagesRoutes };
