import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { STORAGE_KEYS } from '../utils/constants'

export default function ScorecardPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scorecard, setScorecard] = useState(null)
  const [activeInnings, setActiveInnings] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    fetch(`http://localhost:8080/api/matches/${id}/scorecard`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setScorecard(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  if (!scorecard) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Scorecard not found</p>
      <button onClick={() => navigate('/matches')} className="mt-4 text-[#c0392b] text-sm">
        ← Back to Matches
      </button>
    </div>
  )

  return (
    <div className="space-y-6">

      <button
        onClick={() => navigate('/matches')}
        className="flex items-center gap-2 text-gray-500 hover:text-white text-sm"
      >
        ← Back to Matches
      </button>

      {/* Match header */}
      <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <p className="text-white font-bold text-xl">{scorecard.team1}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-600 text-sm">VS</p>
            {scorecard.result && (
              <p className="text-[#22c55e] text-xs font-semibold mt-1">{scorecard.result}</p>
            )}
          </div>
          <div className="text-center sm:text-right">
            <p className="text-white font-bold text-xl">{scorecard.team2}</p>
          </div>
        </div>
      </div>

      {/* Innings tabs */}
      {scorecard.innings && scorecard.innings.length > 0 && (
        <>
          <div className="flex gap-2">
            {scorecard.innings.map((inn, i) => (
              <button
                key={i}
                onClick={() => setActiveInnings(i)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeInnings === i
                    ? 'bg-[#c0392b] text-white'
                    : 'bg-[#1a0a0a] border border-[#3d1010] text-gray-400 hover:text-white'
                }`}
              >
                {inn.battingTeam} Innings
              </button>
            ))}
          </div>

          {/* Innings summary */}
          <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl px-6 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-2xl">
                {scorecard.innings[activeInnings].totalRuns}/{scorecard.innings[activeInnings].totalWickets}
              </p>
              <p className="text-gray-500 text-sm">
                ({(scorecard.innings[activeInnings].totalBalls / 6).toFixed(1)} ov)
              </p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Extras</p>
              <p className="text-gray-400 font-medium">{scorecard.innings[activeInnings].extras}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-xs">Run Rate</p>
              <p className="text-[#fbbf24] font-bold">
                {scorecard.innings[activeInnings].totalBalls > 0
                  ? (scorecard.innings[activeInnings].totalRuns /
                     scorecard.innings[activeInnings].totalBalls * 6).toFixed(2)
                  : '0.00'
                }
              </p>
            </div>
          </div>
        </>
      )}

      {(!scorecard.innings || scorecard.innings.length === 0) && (
        <div className="text-center py-10 bg-[#1a0a0a] border border-[#3d1010] rounded-xl">
          <p className="text-gray-500">No innings data yet</p>
        </div>
      )}

    </div>
  )
}