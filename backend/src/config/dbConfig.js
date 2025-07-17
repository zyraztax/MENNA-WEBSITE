const mongoose = require('mongoose')

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL)
    console.log('Database connected successfully')
  } catch (error) {
    console.log('Database connecting failed:', error)
    process.exit(1)
  }
}

module.exports = connectDB
