import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'

export default function LiveMatchPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [liveData, setLiveData] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchLiveScore = () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    fetch(`http://localhost:8080/api/matches/${id}/live`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setLiveData(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchLiveScore()
    const interval = setInterval(fetchLiveScore, 5000)
    return () => clearInterval(interval)
  }, [id])

  const getBallColor = (ball) => {
    if (ball === 'W') return 'bg-[#c0392b] text-white'
    if (ball === 4)   return 'bg-[#0ea5e9] text-white'
    if (ball === 6)   return 'bg-[#22c55e] text-white'
    if (ball === 0)   return 'bg-[#3d1010] text-gray-400'
    return 'bg-[#1a0a0a] border border-[#3d1010] text-gray-300'
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!liveData) return (
    <div className="text-center py-20">
      <p className="text-gray-500">No live data available</p>
      <button onClick={() => navigate('/matches')} className="mt-4 text-[#c0392b] text-sm">
        ← Back to Matches
      </button>
    </div>
  )

  return (
    <div className="space-y-4">

      <button
        onClick={() => navigate('/matches')}
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm"
      >
        ← Back to Matches
      </button>

      {/* Live header */}
      <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="flex items-center gap-1.5 text-[#ff4444] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#ff4444] animate-pulse"></span>
            LIVE
          </span>
          <span className="text-gray-600 text-xs">Auto refreshing every 5s</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-white font-bold text-lg">{liveData.battingTeam}</p>
            <p className="text-[#fbbf24] font-bold text-4xl">
              {liveData.totalRuns}/{liveData.totalWickets}
            </p>
            <p className="text-gray-500 text-sm">
              ({(liveData.totalBalls / 6).toFixed(1)} ov)
            </p>
          </div>
          <div className="text-right">
            <p className="text-gray-500 text-xs">Bowling</p>
            <p className="text-white font-bold text-lg">{liveData.bowlingTeam}</p>
          </div>
        </div>

        {/* CRR */}
        <div className="mt-4 bg-[#0a0a0a] rounded-lg p-3 text-center">
          <p className="text-gray-500 text-xs">Current Run Rate</p>
          <p className="text-[#22c55e] font-bold text-2xl">{liveData.currentRunRate}</p>
        </div>
      </div>

      {/* Current over */}
      {liveData.currentOver && liveData.currentOver.length > 0 && (
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5">
          <p className="text-gray-500 text-xs mb-3">Current Over</p>
          <div className="flex gap-2">
            {liveData.currentOver.map((ball, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${getBallColor(ball)}`}
              >
                {ball}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}