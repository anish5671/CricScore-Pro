// Calculate total extras
export const calculateExtras = (wides, noBalls, byes, legByes, penalties) => {
  return (wides || 0) + (noBalls || 0) + (byes || 0) + (legByes || 0) + (penalties || 0)
}

// Check if over is complete
export const isOverComplete = (balls) => balls % 6 === 0 && balls > 0

// Get current over number
export const getCurrentOver = (balls) => {
  const completedOvers = Math.floor(balls / 6)
  const ballsInOver    = balls % 6
  return `${completedOvers}.${ballsInOver}`
}

// Check if innings is complete
export const isInningsComplete = (wickets, balls, totalOvers) => {
  return wickets >= 10 || balls >= totalOvers * 6
}

// Calculate projected score
export const getProjectedScore = (runs, balls, totalOvers) => {
  if (!balls || balls === 0) return 0
  const totalBalls = totalOvers * 6
  return Math.round((runs / balls) * totalBalls)
}

// Calculate win probability (simple rule based)
export const getWinProbability = (target, currentRuns, wickets, ballsLeft) => {
  if (!ballsLeft || ballsLeft === 0) return 0
  const runsNeeded  = target - currentRuns
  const wicketsLeft = 10 - wickets
  if (runsNeeded <= 0) return 100
  const rrr = (runsNeeded / ballsLeft) * 6
  if (rrr > 18)       return 5
  if (rrr > 15)       return 15
  if (rrr > 12)       return 30
  if (rrr > 9)        return 50
  if (rrr > 6)        return 70
  return 85
}

// Get balls remaining
export const getBallsRemaining = (totalOvers, ballsBowled) => {
  return (totalOvers * 6) - ballsBowled
}

// Format overs from balls
export const ballsToOvers = (balls) => {
  const overs     = Math.floor(balls / 6)
  const remaining = balls % 6
  return parseFloat(`${overs}.${remaining}`)
}