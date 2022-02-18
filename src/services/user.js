import {LOGIN, ROUTES, BASE_URL} from '@/services/api'
import {request, METHOD, removeAuthorization} from '@/utils/request'

/**
 * 登录服务
 * @param name 账户名
 * @param password 账户密码
 * @returns {Promise<AxiosResponse<T>>}
 */
export async function login(name, password) {
  return request(LOGIN, METHOD.POST, {
    username: name,
    pw: password
  })
}

export async function getRoutesConfig() {
  return request(ROUTES, METHOD.GET)
}

/**
 * 退出登录
 */
export function logout() {
  localStorage.removeItem(process.env.VUE_APP_ROUTES_KEY)
  localStorage.removeItem(process.env.VUE_APP_PERMISSIONS_KEY)
  localStorage.removeItem(process.env.VUE_APP_ROLES_KEY)
  removeAuthorization()
}


export async function getUser(data) {
  return request(`${BASE_URL}/user`, METHOD.GET, data)
}

export async function feed(data) {
  return request(`${BASE_URL}/material`, METHOD.POST, data)
}

export async function getMaterailService(data) {
  return request(`${BASE_URL}/material`, METHOD.GET, data)
}

export async function createUserApi(data) {
  return request(`${BASE_URL}/user`, METHOD.POST, data)
}

export async function createResultApi(data) {
  return request(`${BASE_URL}/result`, METHOD.POST, data)
}

export async function getResultApi(data) {
  return request(`${BASE_URL}/result`, METHOD.GET, data)
}

export async function putResultApi(data) {
  return request(`${BASE_URL}/result`, METHOD.PUT, data)
}

export async function getResultDetailApi(id) {
  return request(`${BASE_URL}/result/${id}`, METHOD.GET)
}

export async function getWinningRateApi(data) {
  return request(`${BASE_URL}/winningRate`, METHOD.GET, data)
}


export default {
  login,
  logout,
  getRoutesConfig,
  feed,
  getUser,
  createUserApi,
}
