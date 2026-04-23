import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

const DUMMY_USERS = [
  { id: 1, name: 'Admin User',   email: 'admin@cricket.com',  role: 'ROLE_ADMIN',  status: 'active',   joined: '2024-01-01' },
  { id: 2, name: 'Scorer One',   email: 'scorer1@cricket.com', role: 'ROLE_SCORER', status: 'active',   joined: '2024-02-15' },
  { id: 3, name: 'Viewer One',   email: 'viewer1@cricket.com', role: 'ROLE_VIEWER', status: 'active',   joined: '2024-03-10' },
  { id: 4, name: 'Scorer Two',   email: 'scorer2@cricket.com', role: 'ROLE_SCORER', status: 'inactive', joined: '2024-03-20' },
  { id: 5, name: 'Viewer Two',   email: 'viewer2@cricket.com', role: 'ROLE_VIEWER', status: 'active',   joined: '2024-04-01' },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState(DUMMY_USERS)

  const getRoleBadge = (role) => {
    if (role === 'ROLE_ADMIN')  return <span className="text-xs px-2 py-1 rounded-full bg-[#c0392b]/20 text-[#c0392b] font-medium">Admin</span>
    if (role === 'ROLE_SCORER') return <span className="text-xs px-2 py-1 rounded-full bg-[#fbbf24]/20 text-[#fbbf24] font-medium">Scorer</span>
    return <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-400 font-medium">Viewer</span>
  }

  const getStatusBadge = (status) => {
    if (status === 'active') return <span className="text-xs px-2 py-1 rounded-full bg-[#22c55e]/20 text-[#22c55e] font-medium">Active</span>
    return <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-500 font-medium">Inactive</span>
  }

  const toggleStatus = (id) => {
    setUsers(users.map(u =>
      u.id === id
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ))
  }

  const stats = [
    { label: 'Total Users',   value: users.length,                              color: '#fbbf24' },
    { label: 'Active Users',  value: users.filter(u => u.status === 'active').length,   color: '#22c55e' },
    { label: 'Scorers',       value: users.filter(u => u.role === 'ROLE_SCORER').length, color: '#c0392b' },
    { label: 'Viewers',       value: users.filter(u => u.role === 'ROLE_VIEWER').length, color: '#0ea5e9' },
  ]

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
        <p className="text-gray-500 text-sm mt-1">Logged in as <span className="text-[#c0392b]">{user?.email}</span></p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-4">
            <p className="text-gray-500 text-xs mb-2">{s.label}</p>
            <p className="font-bold text-2xl" style={{ color: s.color }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#3d1010] gap-4">
        {['users', 'settings'].map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`pb-3 text-sm font-medium capitalize transition-all ${
              activeTab === t
                ? 'text-[#c0392b] border-b-2 border-[#c0392b]'
                : 'text-gray-500 hover:text-white'
            }`}
          >
            {t === 'users' ? 'User Management' : 'Settings'}
          </button>
        ))}
      </div>

      {/* Users tab */}
      {activeTab === 'users' && (
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl">

          {/* Table header */}
          <div className="px-6 py-4 border-b border-[#3d1010] flex items-center justify-between">
            <h2 className="text-white font-semibold">All Users</h2>
            <button className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all">
              + Add User
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-xs uppercase border-b border-[#3d1010]">
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Role</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Joined</th>
                  <th className="px-6 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-[#3d1010]/50 hover:bg-[#0a0a0a] transition-all">

                    {/* User */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#c0392b] flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-xs font-bold">
                            {u.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{u.name}</p>
                          <p className="text-gray-600 text-xs">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">{getRoleBadge(u.role)}</td>

                    {/* Status */}
                    <td className="px-6 py-4">{getStatusBadge(u.status)}</td>

                    {/* Joined */}
                    <td className="px-6 py-4 text-gray-500 text-xs">{u.joined}</td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${
                          u.status === 'active'
                            ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50'
                            : 'bg-green-900/30 text-green-400 hover:bg-green-900/50'
                        }`}
                      >
                        {u.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Settings tab */}
      {activeTab === 'settings' && (
        <div className="bg-[#1a0a0a] border border-[#3d1010] rounded-xl p-6 space-y-5">
          <h2 className="text-white font-semibold">System Settings</h2>

          {[
            { label: 'App Name',         value: 'CricScore',         type: 'text' },
            { label: 'Default Overs',    value: '20',                type: 'number' },
            { label: 'Max Teams',        value: '16',                type: 'number' },
          ].map((s, i) => (
            <div key={i}>
              <label className="block text-gray-400 text-sm font-medium mb-2">{s.label}</label>
              <input
                type={s.type}
                defaultValue={s.value}
                className="
                  w-full max-w-sm px-4 py-2.5 rounded-xl text-sm
                  bg-[#0a0a0a] border border-[#3d1010]
                  text-white
                  focus:outline-none focus:border-[#c0392b]
                  transition-all
                "
              />
            </div>
          ))}

          <button className="bg-[#c0392b] hover:bg-[#e74c3c] text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95">
            Save Settings
          </button>
        </div>
      )}

    </div>
  )
}