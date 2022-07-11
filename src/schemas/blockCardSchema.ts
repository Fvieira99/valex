import joi from "joi";

const blockCardSchema = joi.object({
  cardId: joi.number().required(),
  employeeId: joi.number().required(),
  inputPassword: joi.string().required()
});

export default blockCardSchema;
