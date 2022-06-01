import { celebrate, Joi, Segments } from "celebrate";

const schemaDeleteUserPhoneClient = celebrate({
  [Segments.BODY]: {
    user_id: Joi.string().required(),
  },
});
export { schemaDeleteUserPhoneClient };
