const express = require('express')
const {
  register,
  login,
  authentication,
} = require('../controller/auth.controller')
const csrfProtection = require('../middleware/csrf')
const router = express.Router()

// Registration and login routes
router.post('/register', csrfProtection, register)
router.post('/login', csrfProtection, login)

// Example protected route (for testing JWT middleware)
const { profile } = require('../controller/auth.controller')
router.get('/profile', authentication, profile)

// Route to get CSRF token for frontend forms
router.get('/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() })
})

module.exports = router
