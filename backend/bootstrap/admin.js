const bcrypt = require('bcrypt')
const User = require('../src/model/auth.model')

const createDefaultAdmin = async () => {
  const phoneNumber = '+251945870700'
  const password = 'MennaTestAdmin'
  const role = 'admin'

  const existingAdmin = await User.findOne({ phoneNumber, role })
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    await User.create({ phoneNumber, password: hashedPassword, role })
    console.log(' Default admin created:', phoneNumber)
  }
}

module.exports = createDefaultAdmin
