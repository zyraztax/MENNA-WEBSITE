const Joi = require('joi')

// Member registration validation schema
const memberRegisterSchema = Joi.object({
  phoneNumber: Joi.string()
    .required()
    .custom((value, helpers) => {
      const ethioRegex = /^(\+251|0)?9\d{8}$/
      const safaricomRegex = /^(\+254|0)?7\d{8}$/
      if (!ethioRegex.test(value) && !safaricomRegex.test(value)) {
        return helpers.error('any.invalid')
      }
      return value
    }, 'Phone number validation')
    .messages({
      'any.invalid':
        'Phone number must be valid Ethio Telecom or Safaricom Number.',
    }),
  name: Joi.string().required(),
  occupation: Joi.string()
    .valid(
      'Farmer',
      'Teacher',
      'Student',
      'Engineer',
      'Doctor',
      'Unemployed',
      'Other',
    )
    .required(),
  contribution: Joi.string().required(),
  address: Joi.string().required(),
  monthlyDonation: Joi.number(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('member').default('member'),
})

// Admin registration validation schema
const adminRegisterSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin').required(),
})

// Login validation schema (for both member and admin)
const loginSchema = Joi.object({
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
})

module.exports = {
  memberRegisterSchema,
  adminRegisterSchema,
  loginSchema,
}
