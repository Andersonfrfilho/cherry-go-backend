import express, { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreateImageController } from "@modules/images/useCases/createImage/CreateImage.controller";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";

const imagesRoutes = Router();
const uploadDocument = multer(uploadConfig);
const createImageController = new CreateImageController();

imagesRoutes.use("/view", express.static(`${uploadConfig.tmpFolder}/images`));
imagesRoutes.use(
  "/project/view",
  express.static(`${uploadConfig.assetsFolder}`)
);

imagesRoutes.post(
  "/",
  ensureAuthenticatedInside,
  uploadDocument.single("image"),
  createImageController.handle
);

export { imagesRoutes };
