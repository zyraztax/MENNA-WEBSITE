const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: function () {
        return this.role === 'member'
      },
    },
    name: {
      type: String,
      required: function () {
        return this.role === 'member'
      },
    },
    occupation: {
      type: String,
      required: function () {
        return this.role === 'member'
      },
    },
    contribution: {
      type: String,
      required: function () {
        return this.role === 'member'
      },
    },
    address: {
      type: String,
      required: function () {
        return this.role === 'member'
      },
    },
    monthlyDonation: {
      type: Number,
      min: 0,
      required: function () {
        return this.role === 'member'
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['member', 'admin'],
      default: 'member',
      required: true,
    },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)
module.exports = User
