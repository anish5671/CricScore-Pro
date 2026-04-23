import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../utils/constants'

import MainLayout from '../components/common/MainLayout'
import LoginPage from '../pages/LoginPage'
import RegisterPage from '../pages/RegisterPage'
import DashboardPage from '../pages/DashboardPage'
import MatchesPage from '../pages/MatchesPage'
import LiveMatchPage from '../pages/LiveMatchPage'
import LiveScoringPage from '../pages/LiveScoringPage'
import ScorecardPage from '../pages/ScorecardPage'
import PlayerProfilePage from '../pages/PlayerProfilePage'
import PlayerDetailPage from '../pages/PlayerDetailPage'
import TournamentPage from '../pages/TournamentPage'
import TeamsPage from '../pages/TeamsPage'
import AnalyticsPage from '../pages/AnalyticsPage'
import AdminPage from '../pages/AdminPage'

function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (!isLoggedIn()) return <Navigate to={ROUTES.LOGIN} replace />
  return children
}

function PublicRoute({ children }) {
  const { isLoggedIn } = useAuth()
  if (isLoggedIn()) return <Navigate to={ROUTES.DASHBOARD} replace />
  return children
}

export default function AppRoutes() {
  return (
    <Routes>

      <Route path={ROUTES.LOGIN} element={
        <PublicRoute><LoginPage /></PublicRoute>
      } />
      <Route path={ROUTES.REGISTER} element={
        <PublicRoute><RegisterPage /></PublicRoute>
      } />

      <Route element={
        <ProtectedRoute><MainLayout /></ProtectedRoute>
      }>
        <Route path={ROUTES.DASHBOARD}      element={<DashboardPage />} />
        <Route path={ROUTES.MATCHES}        element={<MatchesPage />} />
        <Route path={ROUTES.LIVE_MATCH}     element={<LiveMatchPage />} />
        <Route path="/matches/:id/scoring"  element={<LiveScoringPage />} />
        <Route path={ROUTES.SCORECARD}      element={<ScorecardPage />} />
        <Route path={ROUTES.PLAYER_PROFILE} element={<PlayerProfilePage />} />
        <Route path="/players/:id"          element={<PlayerDetailPage />} />
        <Route path={ROUTES.TOURNAMENT}     element={<TournamentPage />} />
        <Route path="/teams"                element={<TeamsPage />} />
        <Route path={ROUTES.ANALYTICS}      element={<AnalyticsPage />} />
        <Route path={ROUTES.ADMIN}          element={<AdminPage />} />
      </Route>

      <Route path="*" element={<Navigate to={ROUTES.LOGIN} replace />} />

    </Routes>
  )
}