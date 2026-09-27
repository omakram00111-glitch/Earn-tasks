import React from 'react';
import { LeaderboardUser } from '../types';
import { Trophy, Medal, Sparkles, Flame } from 'lucide-react';

interface LeaderboardViewProps {
  users: LeaderboardUser[];
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ users }) => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Trophy className="h-4 w-4" />
            <span>COMMUNITY EARNINGS LEADERBOARD</span>
            <span aria-hidden="true">·</span>
            <span>$500 DAILY PRIZE POOL</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Top Researchers & Micro-Workers
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Top 10 contributors daily earn automatic streak multipliers and cash pool bonuses.
          </p>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
          <Flame className="h-5 w-5 text-amber-400 fill-amber-400" />
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px]">Today's Pool Reset In:</span>
            <span className="font-mono font-bold text-white">05h 36m 12s</span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-800 bg-slate-950 text-slate-400">
              <tr>
                <th className="py-3.5 px-4 font-medium">Rank</th>
                <th className="py-3.5 px-4 font-medium">Researcher</th>
                <th className="py-3.5 px-4 font-medium">Country</th>
                <th className="py-3.5 px-4 font-medium text-center">Tasks Completed</th>
                <th className="py-3.5 px-4 font-medium text-right">Earned Today</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {users.map((u) => {
                const isTop3 = u.rank <= 3;
                const medalColors = [
                  'text-amber-400',
                  'text-slate-300',
                  'text-amber-600',
                ];

                return (
                  <tr
                    key={u.rank}
                    className={`transition-colors ${
                      u.isCurrentUser
                        ? 'bg-emerald-500/10 hover:bg-emerald-500/15'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold">
                      {isTop3 ? (
                        <span className={`flex items-center gap-1 font-bold ${medalColors[u.rank - 1]}`}>
                          <Medal className="h-4 w-4" />
                          <span>#{u.rank}</span>
                        </span>
                      ) : (
                        <span className="text-slate-500 pl-2">#{u.rank}</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="h-8 w-8 rounded-full object-cover border border-slate-700"
                        />
                        <div>
                          <div className="font-semibold text-white flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {u.isCurrentUser && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded font-mono">
                                You
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500">Verified Contributor</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-400">
                      {u.country}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums text-slate-300">
                      {u.tasksDone} missions
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-400 text-sm">
                      ${u.earningsTodayUsd.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
