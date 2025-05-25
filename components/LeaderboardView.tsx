import React from 'react';
import { DeliveryAgent } from '../types';
import { UserIcon } from './icons/UserIcon'; 
import { BONUS_TOP_PERFORMER_KES, LEADERBOARD_TOP_N_FOR_BONUS } from '../constants';

interface LeaderboardViewProps {
  agents: DeliveryAgent[];
  title: string;
}

export const LeaderboardView: React.FC<LeaderboardViewProps> = ({ agents, title }) => {
  const sortedAgents = [...agents].sort((a, b) => {
    // Primary sort: tasksCompleted descending
    if (b.tasksCompleted !== a.tasksCompleted) {
      return b.tasksCompleted - a.tasksCompleted;
    }
    // Secondary sort: totalGrossEarnings descending (if tasks are tied)
    if (b.totalGrossEarnings !== a.totalGrossEarnings) {
      return b.totalGrossEarnings - a.totalGrossEarnings;
    }
    // Tertiary sort: name ascending (if both tasks and earnings are tied)
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="bg-blitzLight-card dark:bg-blitzGray-dark shadow-xl rounded-lg p-6 border border-blitzLight-border dark:border-blitzGray">
      <h3 className="text-xl font-semibold text-blitzLight-text dark:text-white mb-6">{title}</h3>
      {sortedAgents.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-blitzLight-border dark:divide-blitzGray">
            <thead className="bg-gray-50 dark:bg-blitzGray">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blitzLight-subtleText dark:text-gray-300 uppercase tracking-wider">Rank</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blitzLight-subtleText dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blitzLight-subtleText dark:text-gray-300 uppercase tracking-wider">Tasks</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-blitzLight-subtleText dark:text-gray-300 uppercase tracking-wider">Bonus</th>
              </tr>
            </thead>
            <tbody className="bg-blitzLight-card dark:bg-blitzGray-dark divide-y divide-blitzLight-border dark:divide-blitzGray">
              {sortedAgents.slice(0, 10).map((agent, index) => {
                const isBonusRecipient = index < LEADERBOARD_TOP_N_FOR_BONUS && agent.tasksCompleted > 0; // Must have completed at least one task
                const rankDisplay = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1;
                return (
                  <tr key={agent.id} className={`${isBonusRecipient ? 'bg-yellow-100 dark:bg-yellow-500/10' : (index < 3 ? 'bg-yellow-50 dark:bg-yellow-500/5' : '')}`}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-blitzLight-text dark:text-white">
                        {rankDisplay}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blitzLight-text dark:text-gray-200 flex items-center">
                        <UserIcon className={`w-5 h-5 mr-2 ${isBonusRecipient || index < 3 ? 'text-blitzYellow' : 'text-blitzLight-subtleText dark:text-gray-400'}`} />
                        {agent.name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-blitzLight-subtleText dark:text-gray-300">{agent.tasksCompleted}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {isBonusRecipient ? (
                        <span className="font-semibold text-green-600 dark:text-green-400">🌟 KES {BONUS_TOP_PERFORMER_KES.toFixed(2)}</span>
                      ) : (
                        <span className="text-blitzLight-subtleText dark:text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-blitzLight-subtleText dark:text-gray-400">No agents on the leaderboard yet.</p>
      )}
    </div>
  );
};