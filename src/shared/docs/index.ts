import { Router } from "express";
import swaggerUi from "swagger-ui-express";

import swaggerFile from "@shared/docs/swagger.json";

const docs = Router();

docs.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));
docs.get("/swagger.json", (_, res) => {
  res.sendFile("swagger.json", { root: "./src/shared/docs" });
});
docs.get("/re", (_, res) => {
  res.sendFile("redoc.html", { root: "./src/shared/docs" });
});

export { docs };
