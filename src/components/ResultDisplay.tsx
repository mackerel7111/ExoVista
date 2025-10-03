import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Database, TrendingUp, Info } from 'lucide-react';

interface AnalysisResult {
  isMatch: boolean;
  matchedPlanet?: string;
  database?: string;
  confidence: number;
  analysis: string;
}

interface ResultDisplayProps {
  result: AnalysisResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { isMatch, matchedPlanet, database, confidence, analysis } = result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="glass-panel p-6 md:p-8"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
          style={{
            background: isMatch 
              ? 'linear-gradient(135deg, #10B981, #059669)' 
              : 'linear-gradient(135deg, #F59E0B, #D97706)'
          }}
        >
          {isMatch ? (
            <CheckCircle className="w-8 h-8 text-white" />
          ) : (
            <AlertTriangle className="w-8 h-8 text-white" />
          )}
        </motion.div>

        <motion.h3 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl md:text-3xl font-bold orbitron mb-2 ${
            isMatch ? 'text-green-400' : 'text-yellow-400'
          }`}
        >
          {isMatch ? 'Match Found!' : 'Potential New Candidate'}
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 text-lg"
        >
          {isMatch 
            ? `This planet resembles ${matchedPlanet} from ${database}`
            : 'No exact match found. Further verification needed.'
          }
        </motion.p>
      </div>

      {/* Confidence Score */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-400 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Confidence Score
          </span>
          <span className="text-lg font-bold text-yellow-400">{confidence}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div 
            className={`h-full rounded-full ${
              confidence >= 80 ? 'bg-green-400' :
              confidence >= 60 ? 'bg-yellow-400' : 'bg-orange-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${confidence}%` }}
            transition={{ delay: 1, duration: 1, ease: "easeOut" }}
          />
        </div>
      </motion.div>

      {/* Analysis Details */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4"
      >
        <div className="flex items-start gap-3 p-4 bg-black/20 rounded-lg border border-gray-700">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-white mb-1">Analysis</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{analysis}</p>
          </div>
        </div>

        {isMatch && matchedPlanet && (
          <div className="flex items-start gap-3 p-4 bg-green-900/20 rounded-lg border border-green-400/20">
            <Database className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-green-400 mb-1">Database Match</h4>
              <p className="text-gray-300 text-sm">
                Similar characteristics found in <strong>{database}</strong> for exoplanet <strong>{matchedPlanet}</strong>
              </p>
            </div>
          </div>
        )}

        {!isMatch && (
          <div className="flex items-start gap-3 p-4 bg-yellow-900/20 rounded-lg border border-yellow-400/20">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-yellow-400 mb-1">Next Steps</h4>
              <p className="text-gray-300 text-sm">
                Consider cross-referencing with additional databases or conducting further observational analysis to confirm this potential discovery.
              </p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-700"
      >
        <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
          <Database className="w-4 h-4" />
          View Details
        </button>
        <button className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-gray-500 hover:text-white transition-all duration-300">
          Export Results
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultDisplay;