import { celebrate, Joi, Segments } from "celebrate";

export const schemaActiveTypeInsideService = celebrate({
  [Segments.BODY]: {
    cpf: Joi.string().length(11).optional(),
    rg: Joi.string().min(8).max(9).optional(),
    email: Joi.string().email().lowercase().optional(),
  },
});
