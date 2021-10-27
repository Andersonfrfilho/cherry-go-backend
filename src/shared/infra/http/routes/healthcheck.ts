import { Router } from "express";

const healthcheck = Router();

healthcheck.get("/healthcheck", async (_req, res, _next) => {
  // optional: add further things to check (e.g. connecting to dababase)
  const healthcheckProperty = {
    uptime: process.uptime(),
    message: "OK",
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheckProperty);
  } catch (e) {
    healthcheckProperty.message = e;
    res.status(503).send();
  }
});

export { healthcheck };
