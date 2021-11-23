import { celebrate, Joi, Segments } from "celebrate";
import { differenceInYears } from "date-fns";

import { config } from "@config/environment";

export const schemaCreateUserProvider = celebrate({
  [Segments.BODY]: {
    name: Joi.string().lowercase().required(),
    last_name: Joi.string().lowercase().required(),
    cpf: Joi.string().length(11).required(),
    rg: Joi.string().min(8).max(9).required(),
    gender: Joi.string().required(),
    details: Joi.any().optional(),
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(6).max(15).required(),
    password_confirm: Joi.any()
      .valid(Joi.ref("password"))
      .required()
      .label("Confirm password")
      .options({ messages: { "any.only": "{{#label}} does not match" } }),
    birth_date: Joi.date()
      .iso()
      .required()
      .custom((value, helper) => {
        if (
          differenceInYears(new Date(), value) <
          config.application.minimum_age_required
        ) {
          return helper.message({
            custom: "invalid date_birth, you are a minor",
          });
        }
        return value;
      }),
    term_client: Joi.boolean().required(),
    term_provider: Joi.boolean().required(),
  },
});
