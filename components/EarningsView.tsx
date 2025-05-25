import React, { useState, useMemo } from 'react';
import { DeliveryAgent, DailyEarningsData, EarningsViewProps } from '../types';
import { COMPANY_SHARE_PERCENTAGE, BONUS_TOP_PERFORMER_KES, LEADERBOARD_TOP_N_FOR_BONUS } from '../constants';
import { TrendingUpIcon } from './icons/TrendingUpIcon';
import { PayoutRequestModal } from './PayoutRequestModal';

// Helper to simulate daily earnings calculation for MVP
const getSimulatedDailyEarnings = (
    agent: DeliveryAgent, 
    allAgentsOfSameType: DeliveryAgent[]
): DailyEarningsData => {
  const today = new Date().toISOString().split('T')[0];
  let bonusAwarded = 0;

  // Determine rank and bonus eligibility
  const sortedAgents = [...allAgentsOfSameType].sort((a, b) => {
     if (b.tasksCompleted !== a.tasksCompleted) {
      return b.tasksCompleted - a.tasksCompleted;
    }
    if (b.totalGrossEarnings !== a.totalGrossEarnings) {
      return b.totalGrossEarnings - a.totalGrossEarnings;
    }
    return a.name.localeCompare(b.name);
  });

  const agentRank = sortedAgents.findIndex(a => a.id === agent.id);

  if (agentRank !== -1 && agentRank < LEADERBOARD_TOP_N_FOR_BONUS && agent.tasksCompleted > 0) {
    bonusAwarded = BONUS_TOP_PERFORMER_KES;
  }

  const totalPayoutFromTasks = agent.totalGrossEarnings;
  const companyShare = totalPayoutFromTasks * COMPANY_SHARE_PERCENTAGE;
  const netEarningsFromTasks = totalPayoutFromTasks - companyShare;
  const finalNetEarnings = netEarningsFromTasks + bonusAwarded;

  return {
    date: today,
    tasksCompleted: agent.tasksCompleted,
    totalPayout: totalPayoutFromTasks, // This is gross from tasks only
    companyShare,
    netEarnings: finalNetEarnings, // This includes bonus
    bonusAwarded: bonusAwarded > 0 ? bonusAwarded : undefined,
  };
};

export const EarningsView: React.FC<EarningsViewProps> = ({ agent, allAgentsOfSameType }) => {
  const dailyData = useMemo(() => getSimulatedDailyEarnings(agent, allAgentsOfSameType), [agent, allAgentsOfSameType]);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  return (
    <div className="bg-blitzLight-card dark:bg-blitzGray-dark shadow-xl rounded-lg p-6 border border-blitzLight-border dark:border-blitzGray">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-blitzLight-text dark:text-white flex items-center">
          <TrendingUpIcon className="w-6 h-6 mr-2 text-blitzYellow" />
          Earnings Overview
        </h3>
        {dailyData.netEarnings > 0 && (
            <button
            onClick={() => setIsPayoutModalOpen(true)}
            className="px-4 py-2 text-sm font-medium text-blitzBlack bg-blitzYellow rounded-md hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blitzLight-bg dark:focus:ring-offset-blitzGray-dark focus:ring-blitzYellow transition-colors"
            >
            Request Payout (KES {dailyData.netEarnings.toFixed(2)})
            </button>
        )}
      </div>
      
      <div className="mb-6 p-4 bg-blitzLight-bg dark:bg-blitzGray rounded-md border border-blitzLight-border dark:border-blitzGray-light">
        <h4 className="text-lg font-medium text-blitzLight-text dark:text-gray-200 mb-2">Today's Performance ({dailyData.date})</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-blitzLight-card dark:bg-blitzGray-dark p-3 rounded border border-blitzLight-border dark:border-blitzGray-light">
                <p className="text-blitzLight-subtleText dark:text-gray-400">Tasks Completed:</p>
                <p className="text-2xl font-bold text-blitzLight-text dark:text-white">{dailyData.tasksCompleted}</p>
            </div>
             {dailyData.bonusAwarded && dailyData.bonusAwarded > 0 && (
                <div className="bg-blitzLight-card dark:bg-blitzGray-dark p-3 rounded border border-yellow-400 dark:border-yellow-500">
                    <p className="text-blitzLight-subtleText dark:text-gray-400">Leaderboard Bonus:</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">KES {dailyData.bonusAwarded.toFixed(2)} 🌟</p>
                </div>
            )}
            <div className={`bg-blitzLight-card dark:bg-blitzGray-dark p-3 rounded border border-blitzLight-border dark:border-blitzGray-light ${dailyData.bonusAwarded ? 'sm:col-span-2' : ''}`}>
                <p className="text-blitzLight-subtleText dark:text-gray-400">Your Net Earnings (Est.):</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">KES {dailyData.netEarnings.toFixed(2)}</p>
                 <p className="text-xs text-blitzLight-subtleText dark:text-gray-500 mt-1">
                    (Tasks: KES {(dailyData.netEarnings - (dailyData.bonusAwarded || 0)).toFixed(2)}
                    {dailyData.bonusAwarded ? ` + Bonus: KES ${dailyData.bonusAwarded.toFixed(2)}` : ''})
                </p>
            </div>
        </div>
      </div>
      
      <PayoutRequestModal 
        isOpen={isPayoutModalOpen}
        onClose={() => setIsPayoutModalOpen(false)}
        currentNetEarnings={dailyData.netEarnings}
      />
    </div>
  );
};