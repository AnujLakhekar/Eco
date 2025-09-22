import React from 'react'
import { useAuth } from '../../providers/AuthPrpvider'

const Achievements = () => {
  const { user: AuthUser } = useAuth()
  const data = AuthUser?.get ? AuthUser.get : AuthUser || {}
  const gam = data?.gamification || { level: 1, points: 0, badges: [], ecoRank: 'Newbie' }
  const ch = data?.challenges || { active: [], completed: [], streakDays: 0 }

  const nextLevelPoints = (gam.level + 1) * 200
  const progressPercent = Math.min((gam.points / nextLevelPoints) * 100, 100)

  return (
    <div className="min-h-[60vh] p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Achievements</h1>

      <div role="tablist" className="tabs tabs-boxed w-full">
        <input type="radio" name="ach-tabs" role="tab" className="tab" aria-label="Badges" defaultChecked />
        <div role="tabpanel" className="tab-content bg-base-100 p-4 rounded-box">
          <h2 className="text-lg font-semibold mb-3">Badges ({gam.badges?.length || 0})</h2>
          {gam.badges && gam.badges.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {gam.badges.map((b, i) => (
                <div key={i} className="badge badge-accent badge-lg">{b}</div>
              ))}
            </div>
          ) : (
            <p className="opacity-70">No badges yet. Complete challenges to earn badges.</p>
          )}
        </div>

        <input type="radio" name="ach-tabs" role="tab" className="tab" aria-label="Completed" />
        <div role="tabpanel" className="tab-content bg-base-100 p-4 rounded-box">
          <h2 className="text-lg font-semibold mb-3">Completed Challenges ({ch.completed?.length || 0})</h2>
          {ch.completed && ch.completed.length > 0 ? (
            <ul className="list-disc pl-5 space-y-1">
              {ch.completed.map((c, i) => (
                <li key={i} className="opacity-90">{c?.name || c?.id || 'Challenge'} — +{c?.reward?.points ?? 0} pts</li>
              ))}
            </ul>
          ) : (
            <p className="opacity-70">No completed challenges yet.</p>
          )}
        </div>

        <input type="radio" name="ach-tabs" role="tab" className="tab" aria-label="Progress" />
        <div role="tabpanel" className="tab-content bg-base-100 p-4 rounded-box">
          <h2 className="text-lg font-semibold mb-3">Progress</h2>
          <div className="stats shadow w-full mb-4">
            <div className="stat place-items-center">
              <div className="stat-title">Points</div>
              <div className="stat-value">{gam.points}</div>
              <div className="stat-desc">Eco Rank: {gam.ecoRank}</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Level</div>
              <div className="stat-value text-secondary">{gam.level}</div>
              <div className="stat-desc text-secondary">Progress {Math.floor(progressPercent)}%</div>
            </div>
            <div className="stat place-items-center">
              <div className="stat-title">Badges</div>
              <div className="stat-value">{gam.badges?.length || 0}</div>
              <div className="stat-desc">Total</div>
            </div>
          </div>
          <progress className="progress progress-primary w-full" value={progressPercent} max={100}></progress>
        </div>

        <input type="radio" name="ach-tabs" role="tab" className="tab" aria-label="Streak" />
        <div role="tabpanel" className="tab-content bg-base-100 p-4 rounded-box">
          <h2 className="text-lg font-semibold mb-3">Streak</h2>
          <div className="alert alert-success">
            <span>Current streak: {ch.streakDays || 0} day(s)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Achievements