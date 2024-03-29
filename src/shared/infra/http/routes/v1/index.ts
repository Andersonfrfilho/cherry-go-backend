import { Router } from "express";

import { imagesRoutes } from "@shared/infra/http/routes/v1/images/images.routes";
import { tagsRoutes } from "@shared/infra/http/routes/v1/tags/tags.routes";
import { usersRoutes } from "@shared/infra/http/routes/v1/users";

const v1 = Router();

v1.use("/users", usersRoutes);
v1.use("/images", imagesRoutes);
v1.use("/tags", tagsRoutes);

export { v1 };
