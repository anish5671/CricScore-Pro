import axiosInstance from './axiosInstance'
import { ENDPOINTS } from '../utils/constants'

export const getAllMatches  = ()     => axiosInstance.get(ENDPOINTS.MATCHES)
export const getMatchById  = (id)   => axiosInstance.get(ENDPOINTS.MATCH_BY_ID(id))
export const createMatch   = (data) => axiosInstance.post(ENDPOINTS.MATCHES, data)
export const updateMatch   = (id, data) => axiosInstance.put(ENDPOINTS.MATCH_BY_ID(id), data)
export const deleteMatch   = (id)   => axiosInstance.delete(ENDPOINTS.MATCH_BY_ID(id))
export const getScorecard  = (id)   => axiosInstance.get(ENDPOINTS.SCORECARD(id))
export const addDelivery   = (id, data) => axiosInstance.post(ENDPOINTS.DELIVERY(id), data)
export const getLiveScore  = (id)   => axiosInstance.get(ENDPOINTS.LIVE_SCORE(id))