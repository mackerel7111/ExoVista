import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import type { Player } from './ExplorationPage';

interface LeaderboardProps {
  players: Player[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
  // Sort players by planets owned (primary) and total score (secondary)
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.planetsOwned !== b.planetsOwned) {
      return b.planetsOwned - a.planetsOwned;
    }
    return b.totalScore - a.totalScore;
  });

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 0: return <Crown className="w-5 h-5 text-yellow-400" />;
      case 1: return <Trophy className="w-5 h-5 text-gray-300" />;
      case 2: return <Medal className="w-5 h-5 text-orange-400" />;
      default: return <Award className="w-5 h-5 text-gray-500" />;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 0: return 'from-yellow-400/20 to-orange-500/20 border-yellow-400/30';
      case 1: return 'from-gray-300/20 to-gray-400/20 border-gray-300/30';
      case 2: return 'from-orange-400/20 to-orange-500/20 border-orange-400/30';
      default: return 'from-gray-600/20 to-gray-700/20 border-gray-600/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      className="fixed top-20 right-6 z-20 w-80"
    >
      <div className="glass-panel p-4 border border-yellow-400/20">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-700">
          <Trophy className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-bold orbitron text-yellow-400">Leaderboard</h3>
        </div>

        {/* Players List */}
        <div className="space-y-2">
          {sortedPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`
                p-3 rounded-lg border bg-gradient-to-r transition-all duration-300
                ${getRankColor(index)}
                ${index === 0 ? 'ring-2 ring-yellow-400/30' : ''}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getRankIcon(index)}
                    <span className="text-sm font-bold text-gray-400">#{index + 1}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full border-2 border-white/30"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="font-semibold text-white text-sm">
                      {player.name}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {player.planetsOwned} 🪐
                  </div>
                  <div className="text-xs text-gray-400">
                    {player.totalScore} pts
                  </div>
                </div>
              </div>

              {/* Progress Bar for Planets */}
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Planets Claimed</span>
                  <span>{player.planetsOwned}/20</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <motion.div 
                    className="h-1.5 rounded-full transition-all duration-500"
                    style={{ 
                      backgroundColor: player.color,
                      width: `${(player.planetsOwned / 20) * 100}%`
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(player.planetsOwned / 20) * 100}%` }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Game Stats */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="p-2 bg-black/20 rounded-lg">
              <div className="text-lg font-bold text-yellow-400">
                {sortedPlayers.reduce((sum, player) => sum + player.planetsOwned, 0)}
              </div>
              <div className="text-xs text-gray-400">Claimed</div>
            </div>
            <div className="p-2 bg-black/20 rounded-lg">
              <div className="text-lg font-bold text-blue-400">
                {20 - sortedPlayers.reduce((sum, player) => sum + player.planetsOwned, 0)}
              </div>
              <div className="text-xs text-gray-400">Available</div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <p className="flex items-center gap-2">
              <Crown className="w-3 h-3 text-yellow-400" />
              <span>Ranking: Planets owned → Total score</span>
            </p>
            <p className="flex items-center gap-2">
              <Trophy className="w-3 h-3 text-green-400" />
              <span>Each correct answer = 10 points</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Leaderboard;