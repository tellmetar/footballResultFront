//跨域代理前缀
const API_PROXY_PREFIX='/api_f'

const BASE_URL = process.env.NODE_ENV === 'production' ? process.env.VUE_APP_API_BASE_URL : API_PROXY_PREFIX
// const BASE_URL = API_PROXY_PREFIX
// const BASE_URL = "http://localhost:3000"
module.exports = {
  LOGIN: `${BASE_URL}/login`,
  ROUTES: `${BASE_URL}/routes`,
  BASE_URL
}
