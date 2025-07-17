const User = require('../model/auth.model')
const jwt = require('jsonwebtoken')

// Middleware for Http-only cookies with refresh token
const authentication = async (req, res, next) => {
  const token = req.cookies?.token
  if (!token) {
    return res.status(401).json({ message: 'No token provided' })
  }
  // verify the token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // check user existence
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({ message: 'User not found' })
    }
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

module.exports = authentication
