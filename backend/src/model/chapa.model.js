const mongoose = require('mongoose')

const chapaPaymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  currency: { type: String, default: 'ETB' },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  tx_ref: { type: String, required: true, unique: true },
  callback_url: { type: String, required: true },
  return_url: { type: String, required: true },
  customization: { type: Object },
  status: { type: String, default: 'pending' }, // pending, success, failed
  chapa_response: { type: Object }, // store full Chapa API response
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('ChapaPayment', chapaPaymentSchema)
