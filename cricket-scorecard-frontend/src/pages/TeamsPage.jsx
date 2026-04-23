import { useState, useEffect } from 'react'
import { STORAGE_KEYS } from '../utils/constants'
import CreateTeamModal from '../components/modals/CreateTeamModal'

export default function TeamsPage() {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchTeams = async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN)
    fetch('http://localhost:8080/api/teams', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(data => { setTeams(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchTeams() }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-[#c0392b] border-t-transparent rounded-full animate-spin"></div>
    </div>
  )

  return (
    <div className="space-y-6">

      <CreateTeamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={(newTeam) => {
          setTeams([...teams, newTeam])
          setShowCreateModal(false)
        }}
      />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-white text-2xl font-bold">Teams</h1>
          <p className="text-gray-500 text-sm mt-1">{teams.length} registered teams</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all active:scale-95">
          + New Team
        </button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No teams yet</p>
          <p className="text-gray-600 text-sm mt-1">Create a team to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map(team => (
            <div key={team.id}
              className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-5 hover:border-[#c0392b] transition-all"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#c0392b] flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-lg">
                    {team.shortName?.charAt(0) || team.name?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white font-bold">{team.name}</p>
                  <p className="text-gray-500 text-xs">{team.shortName || '-'}</p>
                </div>
              </div>
              <div className="bg-[#0a0a0a] rounded-lg p-3">
                <p className="text-gray-600 text-xs mb-1">Home Ground</p>
                <p className="text-gray-300 text-sm">{team.homeGround || 'Not specified'}</p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}