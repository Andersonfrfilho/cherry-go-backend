import { Router } from "express";

import { CreateTagsController } from "@modules/tags/useCases/createTags/CreateTags.controller";
import { schemaCreateTags } from "@modules/tags/useCases/createTags/createTags.schema";
import { GetTagsController } from "@modules/tags/useCases/getTags/GetTags.controller";
import { ensureAuthenticatedInside } from "@shared/infra/http/middlewares/ensureAuthenticatedInside";
import { schemaPagination } from "@shared/schemas";

const tagsRoutes = Router();
const createTagsController = new CreateTagsController();
const getTagsController = new GetTagsController();

tagsRoutes.post(
  "/",
  ensureAuthenticatedInside,
  schemaCreateTags,
  createTagsController.handle
);

tagsRoutes.get("/", schemaPagination, getTagsController.handle);

export { tagsRoutes };
