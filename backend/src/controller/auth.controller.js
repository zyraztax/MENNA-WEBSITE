const express = require('express')
const bcrypt = require('bcrypt')
const helmet = require('helmet')
const csurf = require('csurf')
const User = require('../model/auth.model')
const { generateToken, generateRefreshToken } = require('../utils/auth')
const authentication = require('../middleware/auth')

// Helmet for XSS and other HTTP header protections
const app = express()
app.use(helmet())

// ...existing code...

const {
  memberRegisterSchema,
  adminRegisterSchema,
  loginSchema,
} = require('../validators/auth.validator')

// Register a new user (member or admin)
const register = async (req, res) => {
  try {
    const {
      phoneNumber,
      name,
      occupation,
      contribution,
      address,
      monthlyDonation,
      password,
      role: reqRole,
    } = req.body

    const role = reqRole === 'admin' ? 'admin' : 'member'
    // Validate input
    let validationResult
    if (role === 'admin') {
      // Prevent frontend admin registration
      return res
        .status(403)
        .json({ message: 'Admin registration is not allowed from frontend.' })
    }
    // Member validation
    validationResult = memberRegisterSchema.validate(req.body)
    if (validationResult.error) {
      return res
        .status(400)
        .json({ message: validationResult.error.details[0].message })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Build user object
    let user
    if (role === 'admin') {
      user = {
        phoneNumber,
        password: hashedPassword,
        role,
      }
    } else {
      user = {
        phoneNumber,
        name,
        occupation,
        contribution,
        address,
        monthlyDonation,
        password: hashedPassword,
        role,
      }
    }

    // Save user to database
    const newUser = await User.create(user)
    // Remove password from response
    const userResponse = { ...newUser._doc }
    delete userResponse.password
    // Generate JWT and refresh token
    const token = generateToken(newUser)
    const refreshToken = generateRefreshToken(newUser)
    // Set JWT and refresh token as HTTP-only cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
    })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'User registration failed', error: error.message })
  }
}

// Login user (member or admin)
const login = async (req, res) => {
  try {
    const { phoneNumber, password, role } = req.body
    // Determine login type
    let user
    if (role === 'admin') {
      // Admin login by phoneNumber only
      if (!phoneNumber || !password) {
        return res.status(400).json({
          message: 'Phone number and password required for admin login.',
        })
      }
      user = await User.findOne({ phoneNumber, role: 'admin' })
    } else {
      // Member login by phoneNumber
      if (!phoneNumber || !password) {
        return res.status(400).json({
          message: 'Phone number and password required for member login.',
        })
      }
      user = await User.findOne({ phoneNumber, role: 'member' })
    }
    if (!user) {
      return res.status(400).json({ message: 'User not found' })
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid password' })
    }
    // Generate JWT and refresh token
    const token = generateToken(user)
    const refreshToken = generateRefreshToken(user)
    const userResponse = { ...user._doc }
    delete userResponse.password
    // Ensure monthlyDonation is always a number
    if (userResponse.monthlyDonation !== undefined) {
      userResponse.monthlyDonation = Number(userResponse.monthlyDonation) || 10
    }
    // Set JWT and refresh token as HTTP-only cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000, // 1 hour
    })
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    res.status(200).json({
      message: 'Login successful',
      user: userResponse,
    })
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message })
  }
}

// Profile handler (for protected route)
const profile = async (req, res) => {
  try {
    const userResponse = { ...req.user._doc }
    delete userResponse.password
    if (userResponse.monthlyDonation !== undefined) {
      userResponse.monthlyDonation = Number(userResponse.monthlyDonation) || 10
    }
    res.json({ user: userResponse })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch profile', error: error.message })
  }
}

module.exports = {
  register,
  login,
  profile,
  authentication, // Export middleware for use in routes
}
