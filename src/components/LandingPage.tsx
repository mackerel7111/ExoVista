import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Thermometer, Clock, TrendingDown, Sparkles, Star } from 'lucide-react';
import RotatingPlanet from './RotatingPlanet';
import FileUploadArea from './FileUploadArea';
import ManualInputForm from './ManualInputForm';
import ResultDisplay from './ResultDisplay';

interface ExoplanetData {
  orbitalPeriod: number;
  transitDepth: number;
  temperature: number;
}

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [uploadedData, setUploadedData] = useState<ExoplanetData | null>(null);
  const [manualData, setManualData] = useState<ExoplanetData | null>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [newStars, setNewStars] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleFileUpload = (data: ExoplanetData) => {
    setUploadedData(data);
    setManualData(null);
  };

  const handleManualInput = (data: ExoplanetData) => {
    setManualData(data);
    setUploadedData(null);
  };

  const analyzeExoplanet = async () => {
    const data = uploadedData || manualData;
    if (!data) return;

    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock analysis result
    const mockResult = {
      isMatch: Math.random() > 0.4,
      matchedPlanet: "Kepler-442b",
      database: "NASA Exoplanet Archive",
      confidence: Math.floor(Math.random() * 30) + 70,
      analysis: data.temperature > 200 && data.temperature < 400 && data.orbitalPeriod > 100 ? 
        "Potentially habitable zone candidate" : "Hot Jupiter-type exoplanet"
    };
    
    // Add new star if it's a new planet discovery
    if (!mockResult.isMatch) {
      const newStar = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100
      };
      setNewStars(prev => [...prev, newStar]);
      
      // Remove star after animation
      setTimeout(() => {
        setNewStars(prev => prev.filter(star => star.id !== newStar.id));
      }, 5000);
    }
    
    setAnalysisResult(mockResult);
    setIsAnalyzing(false);
  };

  const currentData = uploadedData || manualData;
  const canAnalyze = currentData && currentData.orbitalPeriod > 0 && currentData.transitDepth > 0 && currentData.temperature > 0;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-screen cosmic-gradient overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <RotatingPlanet />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        
        {/* New Discovery Stars */}
        {newStars.map((star) => (
          <motion.div
            key={star.id}
            className="absolute w-4 h-4 pointer-events-none z-10"
            style={{ left: `${star.x}%`, top: `${star.y}%` }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.5, 1, 1.2, 1],
              opacity: [0, 1, 1, 1, 0],
              rotate: [0, 180, 360]
            }}
            transition={{ duration: 5, ease: "easeOut" }}
          >
            <Star className="w-full h-full text-yellow-400 drop-shadow-lg" fill="currentColor" />
            <div className="absolute inset-0 w-full h-full bg-yellow-400 rounded-full blur-md opacity-60" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <motion.header 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="p-6"
        >
          <h1 className="text-2xl md:text-3xl orbitron font-bold text-center bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
            ExoVista
          </h1>
          <p className="text-center text-gray-300 mt-2 text-sm md:text-base">
            Advanced Exoplanet Analysis Platform
          </p>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-4xl">
            {/* Main Headline */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-8"
            >
              <h2 className="text-4xl md:text-6xl orbitron font-bold mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                Is it a New World?
              </h2>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Upload your exoplanet data or input parameters to discover if you've found something extraordinary
              </p>
            </motion.div>

            {/* Explore More Button - More Prominent */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="text-center mb-8"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/explore')}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-bold text-lg rounded-full shadow-lg hover:from-yellow-500 hover:to-yellow-600 transition-all duration-300 glow-gold"
              >
                <Sparkles className="w-6 h-6" />
                Explore Universe 🌌
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Star className="w-5 h-5" />
                </motion.div>
              </motion.button>
              <p className="text-sm text-gray-400 mt-2">Discover known exoplanets in 3D space</p>
            </motion.div>

            {/* Input Panel */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="glass-panel p-6 md:p-8 mb-8 border-2 border-yellow-400/20 hover:border-yellow-400/40 transition-all duration-300"
            >
              <div className="text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-block"
                >
                  <Upload className="w-8 h-8 text-yellow-400 mb-2" />
                </motion.div>
                <h3 className="text-xl font-bold text-yellow-400 mb-2">Data Analysis Center</h3>
                <p className="text-gray-300 text-sm">Choose your preferred method to analyze exoplanet data</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* File Upload */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 bg-black/10"
                >
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                    <Upload className="w-5 h-5" />
                    Upload Data File
                    <motion.div
                      animate={{ y: [-2, 2, -2] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                      className="ml-auto"
                    >
                      📁
                    </motion.div>
                  </h4>
                  <FileUploadArea onDataUpload={handleFileUpload} />
                </motion.div>

                {/* Manual Input */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-4 rounded-lg border border-gray-700/50 hover:border-yellow-400/30 transition-all duration-300 bg-black/10"
                >
                  <h4 className="text-lg font-semibold mb-4 flex items-center gap-2 text-yellow-400">
                    <FileText className="w-5 h-5" />
                    Manual Input
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="ml-auto"
                    >
                      ✏️
                    </motion.div>
                  </h4>
                  <ManualInputForm onDataChange={handleManualInput} />
                </motion.div>
              </div>

              {/* Current Data Display */}
              {currentData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg border border-yellow-400/30 shadow-lg"
                >
                  <h4 className="text-lg font-semibold mb-3 text-yellow-400 flex items-center gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      🔬
                    </motion.div>
                    Current Parameters
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>Orbital Period: {currentData.orbitalPeriod} days</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-green-400" />
                      <span>Transit Depth: {currentData.transitDepth}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-red-400" />
                      <span>Temperature: {currentData.temperature} K</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Analysis Button */}
              <div className="text-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={analyzeExoplanet}
                  disabled={!canAnalyze || isAnalyzing}
                  className={`
                    px-8 py-4 rounded-full text-lg font-semibold orbitron transition-all duration-300 shadow-lg
                    ${canAnalyze 
                      ? 'bg-gradient-to-r from-green-400 to-blue-500 text-white hover:from-green-500 hover:to-blue-600 glow-gold' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {isAnalyzing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      🔍 Check Exoplanet
                    </span>
                  )}
                </motion.button>
              </div>
            </motion.div>

            {/* Results */}
            {analysisResult && (
              <ResultDisplay result={analysisResult} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LandingPage;