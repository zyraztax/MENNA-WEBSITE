const csurf = require('csurf')

// Export the middleware function directly
module.exports = csurf({ cookie: true })
