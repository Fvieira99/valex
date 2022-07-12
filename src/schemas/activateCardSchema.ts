import joi from "joi";

const activateCardSchema = joi.object({
  cardId: joi.number().required(),
  inputSecurityCode: joi.string().required(),
  inputPassword: joi.string().required().min(4).max(4),
  employeeId: joi.number().required()
});

export default activateCardSchema;
