import axiosInstance from './axiosInstance'
import { ENDPOINTS } from '../utils/constants'

export const getAllTournaments     = ()         => axiosInstance.get(ENDPOINTS.TOURNAMENTS)
export const getTournamentById    = (id)       => axiosInstance.get(ENDPOINTS.TOURNAMENT_BY_ID(id))
export const createTournament     = (data)     => axiosInstance.post(ENDPOINTS.TOURNAMENTS, data)
export const updateTournament     = (id, data) => axiosInstance.put(ENDPOINTS.TOURNAMENT_BY_ID(id), data)
export const deleteTournament     = (id)       => axiosInstance.delete(ENDPOINTS.TOURNAMENT_BY_ID(id))
export const getTournamentStandings = (id)     => axiosInstance.get(ENDPOINTS.TOURNAMENT_STANDINGS(id))