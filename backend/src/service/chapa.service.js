const axios = require('axios')
const axiosRetry = require('axios-retry').default || require('axios-retry')
const {
  buildChapaPayload,
  getChapaHeaders,
  logger,
} = require('../utils/chapa.utils')

const CHAPA_BASE_URL = 'https://api.chapa.co/v1'
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay })

exports.initiatePayment = async (paymentData) => {
  try {
    const payload = buildChapaPayload(paymentData)
    const headers = getChapaHeaders()
    const response = await axios.post(
      `${CHAPA_BASE_URL}/transaction/initialize`,
      payload,
      { headers },
    )
    return response.data
  } catch (error) {
    logger.error({
      type: 'chapa_api_error',
      error: error.message,
      response: error.response ? error.response.data : null,
    })
    throw error
  }
}

exports.verifyPayment = async (tx_ref) => {
  try {
    const headers = getChapaHeaders()
    const response = await axios.get(
      `${CHAPA_BASE_URL}/transaction/verify/${tx_ref}`,
      { headers },
    )
    return response.data
  } catch (error) {
    logger.error({
      type: 'chapa_api_error',
      error: error.message,
      response: error.response ? error.response.data : null,
    })
    throw error
  }
}
