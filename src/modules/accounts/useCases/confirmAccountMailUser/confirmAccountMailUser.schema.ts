import { celebrate, Joi, Segments } from "celebrate";

const schemaConfirmAccountMailUser = celebrate({
  [Segments.QUERY]: {
    token: Joi.string().required(),
  },
});

export { schemaConfirmAccountMailUser };
