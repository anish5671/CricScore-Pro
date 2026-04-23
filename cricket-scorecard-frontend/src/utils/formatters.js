// Format overs like 14.3 → "14.3 ov"
export const formatOvers = (overs) => `${overs} ov`

// Format score like 185/4
export const formatScore = (runs, wickets) => `${runs}/${wickets}`

// Format date like 2024-04-01 → "1 Apr 2024"
export const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// Format strike rate to 2 decimal places
export const formatSR = (runs, balls) => {
  if (!balls || balls === 0) return '0.00'
  return ((runs / balls) * 100).toFixed(2)
}

// Format economy rate
export const formatEconomy = (runs, overs) => {
  if (!overs || overs === 0) return '0.00'
  return (runs / overs).toFixed(2)
}

// Format run rate
export const formatRR = (runs, overs) => {
  if (!overs || overs === 0) return '0.00'
  return (runs / overs).toFixed(2)
}

// Get required run rate
export const getRequiredRR = (target, currentRuns, oversLeft) => {
  if (!oversLeft || oversLeft === 0) return '0.00'
  return ((target - currentRuns) / oversLeft).toFixed(2)
}

// Format role label
export const formatRole = (role) => {
  const map = {
    ROLE_ADMIN:  'Admin',
    ROLE_SCORER: 'Scorer',
    ROLE_VIEWER: 'Viewer',
  }
  return map[role] || role
}

// Get match format label
export const formatMatchFormat = (format, customOvers) => {
  if (format === 'LOCAL_CUSTOM') return `Local (${customOvers} ov)`
  return format
}