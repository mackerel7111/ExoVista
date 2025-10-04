import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';
import type { Planet } from './ExplorationPage';

interface PlanetUniverseProps {
  planets: Planet[];
  onPlanetClick: (planet: Planet) => void;
  currentPlayer: string;
  players: Array<{ id: string; name: string; color: string; planetsOwned: number; totalScore: number }>;
}

// Enhanced Planet Component with new styling
const PlanetSphere: React.FC<{
  planet: Planet;
  onClick: () => void;
  currentPlayer: string;
  players: Array<{ id: string; name: string; color: string; planetsOwned: number; totalScore: number }>;
}> = ({ planet, onClick, currentPlayer, players }) => {
  const meshRef = useRef<any>();

  // Calculate 3D position with depth
  const position = useMemo(() => {
    const x = planet.position[0] * 0.8; // Use direct position values
    const y = planet.position[1] * 0.8;
    const z = planet.position[2] * 0.8;
    return [x, y, z];
  }, [planet.position]);

  // Determine planet appearance based on state
  const planetAppearance = useMemo(() => {
    if (planet.claimedBy) {
      // Claimed planets use player color
      const claimingPlayer = players.find(p => p.id === planet.claimedBy);
      return {
        color: claimingPlayer?.color || '#60A5FA',
        size: 0.09, // 20% smaller than before - Medium-large size for claimed planets
        opacity: 1,
        emissiveIntensity: 0.8,
        glowIntensity: 1.2
      };
    } else if (planet.isClaimable) {
      // Claimable planets are larger and more vibrant
      return {
        color: '#6B7280', // Dull gray for all planets with info cards
        size: 0.108, // 20% smaller than before - Largest size for claimable planets
        opacity: 0.9,
        emissiveIntensity: 1.0,
        glowIntensity: 1.5
      };
    } else {
      // Non-interactable planets are golden
      return {
        color: '#6B7280', // Dull gray for all planets with info cards
        size: 0.048, // 20% smaller than before - Smaller size
        opacity: 0.7,
        emissiveIntensity: 0.4,
        glowIntensity: 0.6
      };
    }
  }, [planet.claimedBy, planet.isClaimable, players]);

  // Random floating animation values
  const floatProps = useMemo(() => ({
    speed: 1 + Math.random() * 0.5,
    rotationIntensity: 0.3 + Math.random() * 0.4,
    floatIntensity: 0.3 + Math.random() * 0.4
  }), []);

  return (
    <Float 
      speed={floatProps.speed} 
      rotationIntensity={floatProps.rotationIntensity} 
      floatIntensity={floatProps.floatIntensity}
    >
      <mesh
        ref={meshRef}
        position={position}
        onClick={onClick}
        scale={planet.claimedBy ? 1.2 : planet.isClaimable ? 1.3 : 1}
      >
        {/* Main planet sphere */}
        <sphereGeometry args={[planetAppearance.size, 12, 12]} />
        <meshBasicMaterial
          color={planetAppearance.color}
          transparent
          opacity={planetAppearance.opacity}
        />
        
        {/* Glow effect sphere */}
        <mesh scale={1.6}>
          <sphereGeometry args={[planetAppearance.size, 8, 8]} />
          <meshBasicMaterial
            color={planetAppearance.color}
            transparent
            opacity={0.3}
          />
        </mesh>
        
        {/* Point light for illumination */}
        <pointLight
          color={planetAppearance.color}
          intensity={planetAppearance.glowIntensity}
          distance={3}
        />
      </mesh>
    </Float>
  );
};

// Background Stars Component with improved distribution
const BackgroundStars: React.FC = () => {
  const starsRef = useRef<any>();
  
  const starPositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    const colors = ['#60A5FA', '#34D399', '#F472B6', '#FBBF24', '#A78BFA', '#FB7185'];
    
    for (let i = 0; i < 200; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 25;
    }
    return positions;
  }, []);

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={200}
          array={starPositions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.0225} 
        color="#ffffff" 
        opacity={0.6} 
        transparent 
        sizeAttenuation={true}
      />
    </points>
  );
};

const PlanetUniverse: React.FC<PlanetUniverseProps> = ({ 
  planets, 
  onPlanetClick, 
  currentPlayer, 
  players 
}) => {
  return (
    <div className="absolute inset-0 w-full h-full">
      {/* 3D Canvas with improved camera and controls */}
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{ background: 'transparent' }}
      >
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={0.6} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} color="#60A5FA" />
        
        {/* Background Stars */}
        <BackgroundStars />
        
        {/* Planets */}
        {planets.map((planet) => (
          <PlanetSphere
            key={planet.id}
            planet={planet}
            onClick={() => onPlanetClick(planet)}
            currentPlayer={currentPlayer}
            players={players}
          />
        ))}
        
        {/* Enhanced Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.8}
          rotateSpeed={0.5}
          minDistance={5}
          maxDistance={25}
          autoRotate={true}
          autoRotateSpeed={0.3}
        />
      </Canvas>
      
      {/* Enhanced Overlay UI */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-4 left-4 text-white text-sm bg-black/80 backdrop-blur-sm p-4 rounded-lg border border-white/20 max-w-xs">
          <p className="flex items-center gap-2 font-semibold">
            🌌 Interactive Exoplanet Universe
          </p>
          <p className="text-xs text-gray-300 mt-1">
            Drag to rotate • Scroll to zoom • Click planets to explore
          </p>
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <span>Available Planets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span>Player Claimed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanetUniverse;