import axiosInstance from './axiosInstance'
import { ENDPOINTS } from '../utils/constants'

export const loginApi = (data) =>
  axiosInstance.post(ENDPOINTS.LOGIN, data)

export const registerApi = (data) =>
  axiosInstance.post(ENDPOINTS.REGISTER, data)