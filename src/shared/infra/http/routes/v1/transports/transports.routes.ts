import { Router } from "express";

import { CreateTransportController } from "@modules/transports/useCases/createAppointment/CreateTransport.controller";

const transportsRoutes = Router();
const createTransportController = new CreateTransportController();

transportsRoutes.get("/", createTransportController.handle);

export { transportsRoutes };
