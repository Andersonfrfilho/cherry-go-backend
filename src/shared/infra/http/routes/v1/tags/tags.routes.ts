import { Router } from "express";

import { CreateTagsController } from "@modules/tags/useCases/createTags/CreateTags.controller";
import { schemaCreateTags } from "@modules/tags/useCases/createTags/createTags.schema";
import { ensureAuthenticated } from "@shared/infra/http/middlewares/ensureAuthenticated";

const tagsRoutes = Router();
const createTagsController = new CreateTagsController();

tagsRoutes.post(
  "/",
  ensureAuthenticated,
  schemaCreateTags,
  createTagsController.handle
);

export { tagsRoutes };
