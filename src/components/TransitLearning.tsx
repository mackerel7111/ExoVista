import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';

interface TransitLearningProps {
  onClose: () => void;
}

const TransitLearning: React.FC<TransitLearningProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [transitProgress, setTransitProgress] = useState(0);

  const steps = [
    {
      title: "What is the Transit Method?",
      content: "The transit method detects exoplanets by measuring the slight dimming of a star's light when a planet passes in front of it, like a mini solar eclipse.",
      visual: "intro"
    },
    {
      title: "Observing the Star",
      content: "We continuously monitor the brightness of distant stars using space telescopes like Kepler, TESS, and ground-based observatories.",
      visual: "observation"
    },
    {
      title: "Planet Passes in Front",
      content: "When an exoplanet's orbit aligns with our view, it blocks a tiny fraction of the star's light - typically less than 1%.",
      visual: "transit"
    },
    {
      title: "Light Curve Analysis",
      content: "The resulting light curve shows a characteristic dip in brightness. The depth and duration tell us about the planet's size and orbital period.",
      visual: "lightcurve"
    }
  ];

  const startAnimation = () => {
    setIsAnimating(true);
    setTransitProgress(0);
    
    const interval = setInterval(() => {
      setTransitProgress(prev => {
        if (prev >= 100) {
          setIsAnimating(false);
          clearInterval(interval);
          return 0;
        }
        return prev + 1;
      });
    }, 50);
  };

  const stopAnimation = () => {
    setIsAnimating(false);
    setTransitProgress(0);
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setTransitProgress(0);
  };

  // Generate light curve data
  const generateLightCurve = () => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      let brightness = 1;
      // Create transit dip
      if (i >= 30 && i <= 70) {
        const transitPhase = (i - 30) / 40;
        brightness = 1 - 0.02 * Math.sin(transitPhase * Math.PI);
      }
      points.push({ x: i, y: brightness });
    }
    return points;
  };

  const lightCurvePoints = generateLightCurve();

  const renderVisual = () => {
    switch (steps[currentStep].visual) {
      case "intro":
        return (
          <div className="relative w-full h-64 flex items-center justify-center bg-gradient-to-b from-blue-900/20 to-transparent rounded-lg">
            <div className="text-center">
              <motion.div
                className="w-16 h-16 bg-yellow-400 rounded-full mx-auto mb-4 shadow-lg"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <p className="text-yellow-400 font-semibold">Host Star</p>
              <motion.div
                className="w-4 h-4 bg-blue-400 rounded-full mx-auto mt-4"
                animate={{ x: [-50, 50, -50] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <p className="text-blue-400 text-sm mt-2">Orbiting Exoplanet</p>
            </div>
          </div>
        );

      case "observation":
        return (
          <div className="relative w-full h-64 flex items-center justify-center bg-gradient-to-b from-purple-900/20 to-transparent rounded-lg">
            <div className="relative">
              <motion.div
                className="w-20 h-20 bg-yellow-400 rounded-full shadow-lg"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(255, 215, 0, 0.3)",
                    "0 0 40px rgba(255, 215, 0, 0.6)",
                    "0 0 20px rgba(255, 215, 0, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="absolute -inset-4 border-2 border-dashed border-gray-400 rounded-full animate-spin" 
                   style={{ animationDuration: '10s' }} />
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-4 text-center">
                <p className="text-white font-medium">Continuous Monitoring</p>
                <p className="text-gray-400 text-sm">Measuring brightness over time</p>
              </div>
            </div>
          </div>
        );

      case "transit":
        return (
          <div className="relative w-full h-64 bg-gradient-to-b from-indigo-900/20 to-transparent rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Star */}
              <motion.div
                className="w-24 h-24 bg-yellow-400 rounded-full shadow-lg relative"
                animate={{ 
                  opacity: transitProgress > 30 && transitProgress < 70 ? 0.8 : 1 
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-200 to-yellow-600 rounded-full opacity-80" />
              </motion.div>

              {/* Planet */}
              <motion.div
                className="absolute w-6 h-6 bg-blue-600 rounded-full shadow-lg"
                style={{
                  x: (transitProgress - 50) * 3,
                  zIndex: transitProgress > 30 && transitProgress < 70 ? 10 : 1
                }}
              />
            </div>

            {/* Animation Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <button
                onClick={startAnimation}
                disabled={isAnimating}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm flex items-center gap-1 disabled:opacity-50"
              >
                <Play className="w-3 h-3" />
                Start
              </button>
              <button
                onClick={stopAnimation}
                className="px-3 py-1 bg-red-600 text-white rounded text-sm flex items-center gap-1"
              >
                <Pause className="w-3 h-3" />
                Stop
              </button>
              <button
                onClick={resetAnimation}
                className="px-3 py-1 bg-gray-600 text-white rounded text-sm flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </button>
            </div>
          </div>
        );

      case "lightcurve":
        return (
          <div className="relative w-full h-64 bg-gradient-to-b from-green-900/20 to-transparent rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Light Curve</h4>
            <svg viewBox="0 0 100 50" className="w-full h-32 border border-gray-600 rounded bg-black/20">
              {/* Grid lines */}
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#374151" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100" height="50" fill="url(#grid)" />
              
              {/* Light curve */}
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="1"
                points={lightCurvePoints.map(p => `${p.x},${(1 - p.y) * 50 + 10}`).join(' ')}
              />
              
              {/* Transit annotation */}
              <text x="50" y="8" textAnchor="middle" className="text-xs fill-yellow-400">Transit Dip</text>
              <line x1="30" y1="12" x2="70" y2="12" stroke="#F59E0B" strokeWidth="1" strokeDasharray="2,2" />
            </svg>
            
            <div className="mt-2 flex justify-between text-xs text-gray-400">
              <span>Time</span>
              <span>Brightness: ~1% decrease during transit</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-40"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass-panel p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            <h2 className="text-2xl font-bold orbitron text-yellow-400">Transit Method Learning</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentStep ? 'bg-yellow-400' : 
                  index < currentStep ? 'bg-green-400' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold text-white mb-4">{steps[currentStep].title}</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">{steps[currentStep].content}</p>
            
            {/* Visual */}
            <div className="mb-6">
              {renderVisual()}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="text-sm text-gray-400">
            {currentStep + 1} of {steps.length}
          </div>

          <button
            onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
            disabled={currentStep === steps.length - 1}
            className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-500 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Key Insights */}
        <div className="mt-8 p-4 bg-blue-900/20 border border-blue-400/20 rounded-lg">
          <h4 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Key Insights
          </h4>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>Transit events are periodic - they repeat with each orbit</li>
            <li>Deeper transits indicate larger planets relative to their star</li>
            <li>Transit duration reveals orbital distance and planet size</li>
            <li>Only ~1% of exoplanet orbits align perfectly for transit detection</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TransitLearning;