import express, { Router } from "express";
import multer from "multer";

import uploadConfig from "@config/upload";
import { CreatePhotoProfileUsersController } from "@modules/accounts/useCases/createProfileImageUser/CreateProfileImageUser.controller";
import { schemaCreateProfilePhotoUser } from "@modules/accounts/useCases/createProfileImageUser/createProfileImageUser.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const uploadDocument = multer(uploadConfig);
const profileRoutes = Router();

const createPhotoProfileUsersController = new CreatePhotoProfileUsersController();
profileRoutes.post(
  "/images/view",
  express.static(`${uploadConfig.tmpFolder}/profiles`)
);

profileRoutes.post(
  "/images",
  ensureAuthenticated,
  uploadDocument.single("image_profile"),
  // schemaCreateProfilePhotoUser, TODO:: adicionar schema for file multipartform
  createPhotoProfileUsersController.handle
);

export { profileRoutes };
