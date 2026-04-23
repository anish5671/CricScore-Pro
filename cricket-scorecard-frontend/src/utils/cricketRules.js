// Get standard overs for format
export const getStandardOvers = (format) => {
  const map = {
    T20:  20,
    ODI:  50,
    TEST: null,
  }
  return map[format] || null
}

// Get max overs for a bowler
export const getMaxBowlerOvers = (format, totalOvers) => {
  if (format === 'TEST')         return null
  if (format === 'ODI')          return 10
  if (format === 'T20')          return 4
  if (format === 'LOCAL_CUSTOM') return Math.floor(totalOvers / 4)
  return Math.floor(totalOvers / 4)
}

// Check powerplay
export const isPowerplay = (over, format) => {
  if (format === 'T20')          return over < 6
  if (format === 'ODI')          return over < 10
  if (format === 'LOCAL_CUSTOM') return over < 2
  return false
}

// Get powerplay overs range
export const getPowerplayOvers = (format) => {
  if (format === 'T20')          return '1-6'
  if (format === 'ODI')          return '1-10'
  if (format === 'LOCAL_CUSTOM') return '1-2'
  return null
}

// Validate custom overs
export const isValidCustomOvers = (overs) => {
  return Number.isInteger(overs) && overs >= 1 && overs <= 50
}

// Get death overs range
export const getDeathOvers = (totalOvers) => {
  const start = totalOvers - 4
  return `${start}-${totalOvers}`
}

// Check if no ball
export const isNoBall = (type) => type === 'NO_BALL'

// Check if wide
export const isWide = (type) => type === 'WIDE'

// Check if free hit
export const isFreeHit = (prevDelivery) => prevDelivery?.extraType === 'NO_BALL'

// Get result text
export const getResultText = (winner, margin, marginType) => {
  if (!winner) return 'Match tied'
  if (marginType === 'runs')    return `${winner} won by ${margin} runs`
  if (marginType === 'wickets') return `${winner} won by ${margin} wickets`
  return `${winner} won`
}