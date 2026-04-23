import axiosInstance from './axiosInstance'
import { ENDPOINTS } from '../utils/constants'

export const getAllPlayers  = ()         => axiosInstance.get(ENDPOINTS.PLAYERS)
export const getPlayerById = (id)       => axiosInstance.get(ENDPOINTS.PLAYER_BY_ID(id))
export const getPlayerStats = (id)      => axiosInstance.get(ENDPOINTS.PLAYER_STATS(id))
export const createPlayer  = (data)     => axiosInstance.post(ENDPOINTS.PLAYERS, data)
export const updatePlayer  = (id, data) => axiosInstance.put(ENDPOINTS.PLAYER_BY_ID(id), data)
export const deletePlayer  = (id)       => axiosInstance.delete(ENDPOINTS.PLAYER_BY_ID(id))