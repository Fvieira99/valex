import joi from "joi";

const activateCardSchema = joi.object({
  cardId: joi.number().required(),
  inputSecurityCode: joi.string().required(),
  inputPassword: joi.string().required(),
  employeeId: joi.number().required()
});

export default activateCardSchema;
