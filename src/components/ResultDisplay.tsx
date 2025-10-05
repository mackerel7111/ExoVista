import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertTriangle, Database, TrendingUp, Info } from 'lucide-react';

interface AnalysisResult {
  confidenceScores: {
    confirmed: number;
    candidate: number;
    falsePositive: number;
  };
  interpretation: string;
  keyFeatures: string[];
  uncertaintyIndicator: string;
  followUp: string[];
  contextualPlacement: string;
  isRealPrediction?: boolean;
}

interface ResultDisplayProps {
  result: AnalysisResult;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  const { confidenceScores, interpretation, keyFeatures, uncertaintyIndicator, followUp, contextualPlacement, isRealPrediction } = result;
  const isConfirmed = confidenceScores.confirmed > 0.6;

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
            background: isConfirmed 
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'linear-gradient(135deg, #F59E0B, #D97706)'
          }}
        >
          {isConfirmed ? (
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
            isConfirmed ? 'text-green-400' : 'text-yellow-400'
          }`}
        >
          {isConfirmed ? 'Planet Confirmed!' : 'Analysis Complete'}
          {isRealPrediction && (
            <span className="text-sm font-normal text-blue-400 block mt-1">
              🤖 ML Model Prediction
            </span>
          )}
        </motion.h3>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-gray-300 text-lg"
        >
          {interpretation}
        </motion.p>
      </div>

      {/* Confidence Scores */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="mb-6"
      >
        <h4 className="text-lg font-semibold text-yellow-400 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
          Confidence Scores
        </h4>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700">
            <div>
              <span className="font-medium text-green-400">Confirmed</span>
              <p className="text-xs text-gray-400">Consistent with known planetary signatures</p>
            </div>
            <span className="text-lg font-bold text-green-400">{(confidenceScores.confirmed * 100).toFixed(0)}%</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700">
            <div>
              <span className="font-medium text-yellow-400">Candidate</span>
              <p className="text-xs text-gray-400">Requires further validation</p>
            </div>
            <span className="text-lg font-bold text-yellow-400">{(confidenceScores.candidate * 100).toFixed(0)}%</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-gray-700">
            <div>
              <span className="font-medium text-red-400">False Positive</span>
              <p className="text-xs text-gray-400">Likely stellar variability or noise</p>
            </div>
            <span className="text-lg font-bold text-red-400">{(confidenceScores.falsePositive * 100).toFixed(0)}%</span>
          </div>
        </div>
      </motion.div>

      {/* Key Features */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="space-y-4 mb-6"
      >
        <h4 className="text-lg font-semibold text-yellow-400 mb-3 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          Key Features Contributing to Classification
        </h4>
        
        <div className="space-y-2">
          {keyFeatures.map((feature, index) => (
            <div key={index} className="p-3 bg-blue-900/20 rounded-lg border border-blue-400/20">
              <p className="text-gray-300 text-sm">{feature}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Uncertainty Indicator */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        className="mb-6"
      >
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-400/20">
          <h4 className="font-semibold text-purple-400 mb-2">Uncertainty Indicator</h4>
          <p className="text-gray-300 text-sm">{uncertaintyIndicator}</p>
        </div>
      </motion.div>

      {/* Follow-up Suggestions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="mb-6"
      >
        <h4 className="text-lg font-semibold text-yellow-400 mb-3">Suggested Follow-Up</h4>
        <div className="space-y-2">
          {followUp.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-green-900/20 rounded-lg border border-green-400/20">
              <Database className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-gray-300 text-sm">{suggestion}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contextual Placement */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.6 }}
        className="mb-6"
      >
        <div className="p-4 bg-yellow-900/20 rounded-lg border border-yellow-400/20">
          <h4 className="font-semibold text-yellow-400 mb-2">Contextual Placement</h4>
          <p className="text-gray-300 text-sm">{contextualPlacement}</p>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-700"
      >
        <button className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2">
          <Database className="w-4 h-4" />
          Export Analysis
        </button>
        <button className="flex-1 px-6 py-3 border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-gray-500 hover:text-white transition-all duration-300">
          Save Report
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ResultDisplay;