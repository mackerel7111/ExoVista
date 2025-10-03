import React from 'react';
import { motion } from 'framer-motion';

const RotatingPlanet: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {/* Main Planet */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-full bg-gradient-to-br from-yellow-400/20 via-orange-500/15 to-red-600/10 planet-glow relative overflow-hidden">
          {/* Surface Details */}
          <div className="absolute inset-0 rounded-full">
            {/* Atmospheric glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/10 via-transparent to-blue-600/5" />
            
            {/* Surface patterns */}
            <div className="absolute top-1/4 left-1/3 w-16 h-16 md:w-20 md:h-20 rounded-full bg-yellow-500/20 blur-sm" />
            <div className="absolute bottom-1/3 right-1/4 w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-400/15 blur-sm" />
            <div className="absolute top-1/2 right-1/3 w-8 h-8 md:w-12 md:h-12 rounded-full bg-red-500/20 blur-sm" />
            
            {/* Terminator line */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-black/20 to-transparent" />
          </div>
        </div>

        {/* Orbital rings */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 200, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[600px] h-[600px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px] border border-yellow-400/10 rounded-full" />
        </motion.div>

        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 180, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-[650px] h-[650px] md:w-[750px] md:h-[750px] lg:w-[850px] lg:h-[850px] border border-silver/10 rounded-full" />
        </motion.div>
      </motion.div>

      {/* Distant stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1 h-1 bg-white rounded-full ${i % 2 === 0 ? 'pulsing-glow' : ''}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.8 + 0.2
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingPlanet;