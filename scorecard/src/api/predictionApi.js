import axiosInstance from './axiosInstance'
import { ENDPOINTS } from '../utils/constants'

export const predictScore = (data) =>
  axiosInstance.post(ENDPOINTS.PREDICT_SCORE, data)

export const getMatchInsights = (matchId) =>
  axiosInstance.get(ENDPOINTS.COMMENTARY(matchId))