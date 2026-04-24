import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS, RUN_OPTIONS, DISMISSAL_TYPES } from '../utils/constants'
import { useAuth } from '../context/AuthContext'

export default function LiveScoringPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAdmin, isScorer } = useAuth()

  const [match, setMatch] = useState(null)
  const [innings, setInnings] = useState(null)
  const [battingPlayers, setBattingPlayers] = useState([])
  const [bowlingPlayers, setBowlingPlayers] = useState([])
  const [liveScore, setLiveScore] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [overComplete, setOverComplete] = useState(false)
  const [inningsStarting, setInningsStarting] = useState(false)

  const [delivery, setDelivery] = useState({
    batsmanId: '',
    nonStrikerId: '',
    bowlerId: '',
    runs: 0,
    isWicket: false,
    dismissalType: '',
    isWide: false,
    isNoBall: false,
    isBye: false,
    extraRuns: 0,
  })

  const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
  const headers = { 'Authorization': `Bearer ${token}` }
  const canScore = isAdmin() || isScorer()

  const fetchLiveScore = useCallback(() => {
    fetch(`http://localhost:8080/api/matches/${id}/live`, { headers })
      .then(r => r.json())
      .then(data => {
        if (!data.error) {
          setLiveScore(data)
          if ((data?.totalBalls ?? 0) > 0 && data.totalBalls % 6 === 0) {
            setOverComplete(true)
          }
        }
      })
      .catch(() => {})
  }, [id])

  const loadPlayers = useCallback(async (matchData, inningsData) => {
    try {
      // Try playing 11 first
      const battingTeamId = inningsData.battingTeamId || matchData.team1Id
      const bowlingTeamId = inningsData.bowlingTeamId || matchData.team2Id

      const [bp, bowlp] = await Promise.all([
        fetch(`http://localhost:8080/api/players/team/${battingTeamId}`, { headers }).then(r => r.json()),
        fetch(`http://localhost:8080/api/players/team/${bowlingTeamId}`, { headers }).then(r => r.json()),
      ])
      setBattingPlayers(Array.isArray(bp) ? bp : [])
      setBowlingPlayers(Array.isArray(bowlp) ? bowlp : [])
    } catch (e) {}
  }, [id])

  useEffect(() => {
    const init = async () => {
      try {
        const matchRes = await fetch(`http://localhost:8080/api/matches/${id}`, { headers })
        const matchData = await matchRes.json()
        setMatch(matchData)

        // Check existing innings
        try {
          const inningsRes = await fetch(`http://localhost:8080/api/matches/${id}/innings/1`, { headers })
          if (inningsRes.ok) {
            const inningsData = await inningsRes.json()
            if (inningsData?.id) {
              setInnings(inningsData)
              await loadPlayers(matchData, inningsData)
            } else {
              // Auto start innings based on toss
              await autoStartInnings(matchData)
            }
          } else {
            await autoStartInnings(matchData)
          }
        } catch (e) {
          await autoStartInnings(matchData)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [id])

  const autoStartInnings = async (matchData) => {
    if (!matchData || inningsStarting) return
    setInningsStarting(true)
    try {
      // Toss winner decides who bats
      let battingTeamId = matchData.team1Id
      let bowlingTeamId = matchData.team2Id

      if (matchData.tossWinner && matchData.tossDecision) {
        const tossWinnerIsteam1 = matchData.team1Name === matchData.tossWinner
        if (matchData.tossDecision === 'BAT') {
          battingTeamId = tossWinnerIsteam1 ? matchData.team1Id : matchData.team2Id
          bowlingTeamId = tossWinnerIsteam1 ? matchData.team2Id : matchData.team1Id
        } else {
          battingTeamId = tossWinnerIsteam1 ? matchData.team2Id : matchData.team1Id
          bowlingTeamId = tossWinnerIsteam1 ? matchData.team1Id : matchData.team2Id
        }
      }

      const response = await fetch(
        `http://localhost:8080/api/matches/${id}/innings/start?battingTeamId=${battingTeamId}&bowlingTeamId=${bowlingTeamId}&inningsNumber=1`,
        { method: 'POST', headers }
      )
      if (response.ok) {
        const data = await response.json()
        setInnings(data)
        await loadPlayers(matchData, { battingTeamId, bowlingTeamId })
      }
    } catch (e) {
      setMessage('Error starting innings')
    } finally {
      setInningsStarting(false)
    }
  }

  useEffect(() => {
    if (!innings) return
    fetchLiveScore()
    const interval = setInterval(fetchLiveScore, 3000)
    return () => clearInterval(interval)
  }, [innings, fetchLiveScore])

  const resetDelivery = (keepBowler = false) => {
    setDelivery(prev => ({
      ...prev,
      runs: 0,
      isWicket: false,
      dismissalType: '',
      isWide: false,
      isNoBall: false,
      isBye: false,
      extraRuns: 0,
      bowlerId: keepBowler ? prev.bowlerId : '',
    }))
  }

  const swapBatsmen = () => {
    setDelivery(prev => ({
      ...prev,
      batsmanId: prev.nonStrikerId,
      nonStrikerId: prev.batsmanId,
    }))
  }

  const handleAddDelivery = async () => {
    if (!canScore) { setMessage('You do not have permission to score!'); return }
    if (!delivery.batsmanId || !delivery.bowlerId) { setMessage('Please select batsman and bowler!'); return }
    if (overComplete) { setMessage('Over complete! Please select new bowler first!'); return }

    setSubmitting(true)
    setMessage('')

    try {
      const response = await fetch(
        `http://localhost:8080/api/matches/${id}/innings/${innings.id}/delivery`,
        {
          method: 'POST',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            batsmanId:     parseInt(delivery.batsmanId),
            bowlerId:      parseInt(delivery.bowlerId),
            runs:          delivery.runs,
            isWicket:      delivery.isWicket,
            dismissalType: delivery.isWicket ? delivery.dismissalType : null,
            isWide:        delivery.isWide,
            isNoBall:      delivery.isNoBall,
            isExtra:       delivery.isBye,
            extraType:     delivery.isBye ? 'BYE' : null,
            extraRuns:     delivery.extraRuns,
          })
        }
      )

      if (response.ok) {
        fetchLiveScore()

        const totalRuns = delivery.runs + delivery.extraRuns
        if (!delivery.isWide && !delivery.isNoBall && totalRuns % 2 !== 0) {
          swapBatsmen()
        }

        const newBalls = ((liveScore?.totalBalls ?? 0)) + ((!delivery.isWide && !delivery.isNoBall) ? 1 : 0)
        if (newBalls > 0 && newBalls % 6 === 0) {
          setOverComplete(true)
          setMessage('Over complete! Select new bowler!')
          swapBatsmen()
          resetDelivery(false)
        } else {
          let summary = ''
          if (delivery.isWide)          summary = 'Wide! +1 run'
          else if (delivery.isNoBall)   summary = 'No Ball! +1 run'
          else if (delivery.isWicket)   summary = 'WICKET!'
          else if (delivery.runs === 6) summary = 'SIX! 🎉'
          else if (delivery.runs === 4) summary = 'FOUR! 🏏'
          else                          summary = `${delivery.runs} run(s) added`
          setMessage(summary)
          resetDelivery(true)
          setTimeout(() => setMessage(''), 2000)
        }
      } else {
        const err = await response.json()
        setMessage(err.error || 'Error adding delivery')
      }
    } catch (err) {
      setMessage('Server error')
    } finally {
      setSubmitting(false)
    }
  }

  const getBallDisplay = (ball) => {
    if (ball === 'W')  return { label: 'W',  color: 'bg-[#c0392b] text-white' }
    if (ball === 'Wd') return { label: 'Wd', color: 'bg-[#f97316] text-white' }
    if (ball === 'Nb') return { label: 'Nb', color: 'bg-[#f97316] text-white' }
    if (ball === 6)    return { label: '6',  color: 'bg-[#22c55e] text-white' }
    if (ball === 4)    return { label: '4',  color: 'bg-[#0ea5e9] text-white' }
    if (ball === 0)    return { label: '0',  color: 'bg-[#3d1010] text-gray-400' }
    return { label: String(ball), color: 'bg-[#1a0a0a] border border-[#3d1010] text-gray-300' }
  }

  if (loading || inningsStarting) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-400 text-sm ml-3">
        {inningsStarting ? 'Starting innings...' : 'Loading...'}
      </p>
    </div>
  )

  return (
    <div className="space-y-4 pb-10">

      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/matches')} className="text-gray-500 hover:text-white text-sm">← Back</button>
        <h1 className="text-white font-bold text-lg">Live Scoring</h1>
        <span className="flex items-center gap-1.5 text-[#ff4444] text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-[#ff4444] animate-pulse"></span>
          LIVE
        </span>
      </div>

      {match && (
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-4 text-center">
          <p className="text-white font-bold text-lg">{match.team1Name} vs {match.team2Name}</p>
          <p className="text-gray-500 text-xs mt-1">
            {match.format === 'LOCAL_CUSTOM' ? `Local (${match.customOvers} ov)` : match.format}
          </p>
          {match.tossWinner && (
            <p className="text-gray-600 text-xs mt-1">
              {match.tossWinner} won toss — elected to {match.tossDecision === 'BAT' ? 'bat' : 'bowl'}
            </p>
          )}
        </div>
      )}

      {!canScore && (
        <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm font-medium">Viewers cannot score matches</p>
        </div>
      )}

      {liveScore && innings && (
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-gray-500 text-xs mb-1">{liveScore.battingTeam} batting</p>
              <p className="text-[#fbbf24] font-bold text-4xl">
                {liveScore.totalRuns}/{liveScore.totalWickets}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                ({Math.floor(liveScore.totalBalls / 6)}.{liveScore.totalBalls % 6} ov)
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">CRR</p>
              <p className="text-[#22c55e] font-bold text-2xl">{liveScore.currentRunRate}</p>
            </div>
          </div>

          {liveScore.currentOver?.length > 0 && (
            <div className="mt-3">
              <p className="text-gray-600 text-xs mb-2">This over</p>
              <div className="flex gap-2 flex-wrap">
                {liveScore.currentOver.map((ball, i) => {
                  const { label, color } = getBallDisplay(ball)
                  return (
                    <div key={`ball-${i}-${label}`}
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${color}`}>
                      {label}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {innings && canScore && (
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5 space-y-5">
          <h2 className="text-white font-semibold">Add Delivery</h2>

          {overComplete && (
            <div className="bg-[#fbbf24]/20 border border-[#fbbf24] rounded-lg px-4 py-3">
              <p className="text-[#fbbf24] text-sm font-medium text-center">
                Over complete! Select new bowler to continue
              </p>
            </div>
          )}

          {message && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium text-center ${
              message.includes('Error') || message.includes('Please') || message.includes('permission')
                ? 'bg-red-900/30 text-red-400'
                : 'bg-green-900/30 text-[#22c55e]'
            }`}>
              {message}
            </div>
          )}

          {/* Striker — only batting team */}
          <div>
            <label htmlFor="striker" className="block text-gray-400 text-xs font-medium mb-1.5">
              Striker (batting) *
            </label>
            <select id="striker" value={delivery.batsmanId}
              onChange={e => setDelivery({ ...delivery, batsmanId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              <option value="">Select Striker</option>
              {battingPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Non striker — only batting team */}
          <div>
            <label htmlFor="nonStriker" className="block text-gray-400 text-xs font-medium mb-1.5">
              Non-Striker
            </label>
            <select id="nonStriker" value={delivery.nonStrikerId}
              onChange={e => setDelivery({ ...delivery, nonStrikerId: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
              <option value="">Select Non-Striker</option>
              {battingPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <button type="button" onClick={swapBatsmen}
            className="w-full py-2 rounded-lg text-xs font-medium bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white transition-all">
            ⇄ Swap Striker / Non-Striker
          </button>

          {/* Bowler — only bowling team */}
          <div>
            <label htmlFor="bowler" className="block text-gray-400 text-xs font-medium mb-1.5">
              Bowler * {overComplete && <span className="text-[#fbbf24]">(Change bowler!)</span>}
            </label>
            <select id="bowler" value={delivery.bowlerId}
              onChange={e => {
                setDelivery({ ...delivery, bowlerId: e.target.value })
                setOverComplete(false)
              }}
              className={`w-full px-3 py-2.5 rounded-lg text-sm bg-[#0a0a0a] text-white focus:outline-none transition-all ${
                overComplete ? 'border-2 border-[#fbbf24]' : 'border border-[#3d1010] focus:border-[#c0392b]'
              }`}>
              <option value="">Select Bowler</option>
              {bowlingPlayers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">Runs scored</label>
            <div className="flex gap-2">
              {RUN_OPTIONS.map(run => (
                <button key={run} type="button"
                  onClick={() => setDelivery({ ...delivery, runs: run })}
                  className={`w-12 h-12 rounded-full font-bold text-lg transition-all active:scale-95 ${
                    delivery.runs === run
                      ? run === 4 ? 'bg-[#0ea5e9] text-white border-2 border-[#0ea5e9]'
                        : run === 6 ? 'bg-[#22c55e] text-white border-2 border-[#22c55e]'
                        : 'bg-[#c0392b] text-white border-2 border-[#c0392b]'
                      : 'bg-[#0a0a0a] border-2 border-[#3d1010] text-gray-400 hover:border-[#c0392b] hover:text-white'
                  }`}>
                  {run}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-medium mb-2">Delivery type</label>
            <div className="grid grid-cols-2 gap-2">
              <button type="button"
                onClick={() => setDelivery({ ...delivery, isWide: !delivery.isWide, isNoBall: false })}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  delivery.isWide ? 'bg-[#f97316] text-white' : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                }`}>
                Wide (+1 run)
              </button>
              <button type="button"
                onClick={() => setDelivery({ ...delivery, isNoBall: !delivery.isNoBall, isWide: false })}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  delivery.isNoBall ? 'bg-[#f97316] text-white' : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                }`}>
                No Ball (+1 run)
              </button>
              <button type="button"
                onClick={() => setDelivery({ ...delivery, isBye: !delivery.isBye })}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  delivery.isBye ? 'bg-[#fbbf24] text-black' : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                }`}>
                Bye
              </button>
              <button type="button"
                onClick={() => setDelivery({ ...delivery, isWicket: !delivery.isWicket })}
                className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                  delivery.isWicket ? 'bg-[#c0392b] text-white' : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                }`}>
                Wicket
              </button>
            </div>
          </div>

          {(delivery.isWide || delivery.isNoBall || delivery.isBye) && (
            <div>
              <label className="block text-gray-400 text-xs font-medium mb-1.5">Extra runs</label>
              <div className="flex gap-2">
                {[0,1,2,3,4].map(r => (
                  <button key={r} type="button"
                    onClick={() => setDelivery({ ...delivery, extraRuns: r })}
                    className={`w-10 h-10 rounded-full text-sm font-bold transition-all ${
                      delivery.extraRuns === r ? 'bg-[#fbbf24] text-black' : 'bg-[#0a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {delivery.isWicket && (
            <div>
              <label htmlFor="dismissal" className="block text-gray-400 text-xs font-medium mb-1.5">Dismissal Type</label>
              <select id="dismissal" value={delivery.dismissalType}
                onChange={e => setDelivery({ ...delivery, dismissalType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm bg-[#0a0a0a] border border-[#3d1010] text-white focus:outline-none focus:border-[#c0392b]">
                <option value="">Select dismissal type</option>
                {DISMISSAL_TYPES.filter(d => d.value !== 'NOT_OUT').map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
          )}

          <div className="bg-[#0a0a0a] rounded-lg p-3 text-xs text-gray-500">
            <span className="text-gray-400 font-medium">Preview: </span>
            {delivery.isWide && <span className="text-[#f97316]">Wide </span>}
            {delivery.isNoBall && <span className="text-[#f97316]">No Ball </span>}
            {delivery.isBye && <span className="text-[#fbbf24]">Bye </span>}
            {delivery.isWicket && <span className="text-[#c0392b]">WICKET ({delivery.dismissalType || '?'}) </span>}
            <span className="text-white font-bold">
              {delivery.isWide ? 1 : delivery.runs} run(s)
            </span>
            {(delivery.isWide || delivery.isNoBall || delivery.isBye) && delivery.extraRuns > 0 &&
              <span className="text-[#fbbf24]"> + {delivery.extraRuns} extra</span>
            }
          </div>

          <button onClick={handleAddDelivery} disabled={submitting || overComplete}
            className="w-full py-3 bg-[#c0392b] hover:bg-[#e74c3c] text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-50 active:scale-95">
            {submitting ? 'Adding...' : overComplete ? 'Select new bowler first!' : 'Add Ball ✓'}
          </button>

        </div>
      )}

    </div>
  )
}