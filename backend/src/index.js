// Create default admin on server start
const createDefaultAdmin = require('../bootstrap/admin')
createDefaultAdmin()
const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const csurf = require('csurf')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')

//Intialization express app
const app = express()
// Use helmet for XSS and HTTP header protections
app.use(helmet())

// Use cookie-parser for CSRF cookies
app.use(cookieParser())

// middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Use csurf for CSRF protection (must come after cookieParser and body parsers)
app.use(csurf({ cookie: true }))

// API routes
const authRoutes = require('./routes/auth.routes')
app.use('/api/auth', authRoutes)
const chapaRoutes = require('./routes/chapa.routes')
app.use('/api/payment', chapaRoutes)

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected')
    // port
    const port = process.env.PORT
    app.listen(port, () => {
      console.log(`server is running on port ${port}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err)
  })
