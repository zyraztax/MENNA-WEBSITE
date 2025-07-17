const Joi = require('joi')

// Payment data validation schema for Chapa
const chapaPaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().default('ETB'),
  email: Joi.string().email().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  tx_ref: Joi.string().required(),
  callback_url: Joi.string().uri().required(),
  return_url: Joi.string().uri().required(),
  customization: Joi.object().optional(),
})

module.exports = {
  chapaPaymentSchema,
}
