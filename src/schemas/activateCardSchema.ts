import joi from "joi";

const activateCardSchema = joi.object({
  cardId: joi.number().required(),
  inputSecurityCode: joi.string().required(),
  password: joi.string().required(),
  employeeId: joi.number().required()
});

export default activateCardSchema;
