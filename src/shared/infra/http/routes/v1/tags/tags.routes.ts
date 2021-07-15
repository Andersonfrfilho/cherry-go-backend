import { Router } from "express";

import { CreateTagsController } from "@modules/tags/useCases/createTags/CreateTags.controller";
import { schemaCreateTags } from "@modules/tags/useCases/createTags/createTags.schema";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";

const tagsRoutes = Router();
const createTagsController = new CreateTagsController();

tagsRoutes.post(
  "/",
  ensureAuthenticatedInside,
  schemaCreateTags,
  createTagsController.handle
);

export { tagsRoutes };
