const express = require('express')
const router = express.Router()
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const csurf = require('csurf')
const chapaController = require('../controller/chapa.controller')

// Security middlewares
router.use(helmet())
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }))
router.use(csurf({ cookie: true }))

// Initiate payment
router.post('/pay', chapaController.initiatePayment)

// Verify payment
router.get('/verify', chapaController.verifyPayment)

// Chapa webhook endpoint
router.post('/webhook', express.json(), chapaController.webhook)

module.exports = router
