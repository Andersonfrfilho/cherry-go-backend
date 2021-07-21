import { celebrate, Joi, Segments } from "celebrate";

const schemaUsersTypeInsideUser = celebrate({
  [Segments.BODY]: {
    id: Joi.string().uuid().required(),
  },
});

export { schemaUsersTypeInsideUser };
