import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Info } from 'lucide-react';
import PlanetUniverse from './PlanetUniverse';
import Leaderboard from './Leaderboard';
import PlanetClaimModal from './PlanetClaimModal';
import TransitLearning from './TransitLearning';

interface Player {
  id: string;
  name: string;
  color: string;
  planetsOwned: number;
  totalScore: number;
}

interface Planet {
  id: string;
  name: string;
  distance: string;
  hostStar: string;
  orbitalPeriod: string;
  temperature: string;
  discoveryMethod: string;
  discoveryYear: number;
  description: string;
  funFact: string;
  position: [number, number, number];
  claimedBy?: string;
  claimTime?: number;
}

interface ExplorationPageProps {
  onBack: () => void;
}

const ExplorationPage: React.FC<ExplorationPageProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [currentPlayer, setCurrentPlayer] = useState('player1');
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [showTransitLearning, setShowTransitLearning] = useState(false);
  const [players, setPlayers] = useState<Player[]>([
    { id: 'player1', name: 'Player 1', color: '#FF4C4C', planetsOwned: 0, totalScore: 0 },
    { id: 'player2', name: 'Player 2', color: '#1E40AF', planetsOwned: 0, totalScore: 0 },
    { id: 'player3', name: 'Player 3', color: '#4CFF72', planetsOwned: 0, totalScore: 0 },
    { id: 'player4', name: 'Player 4', color: '#FFD84C', planetsOwned: 0, totalScore: 0 },
    { id: 'player5', name: 'Player 5', color: '#C44CFF', planetsOwned: 0, totalScore: 0 }
  ]);

  const [planets, setPlanets] = useState<Planet[]>([
    {
      id: 'kepler-186f',
      name: 'Kepler-186f',
      distance: '492 light-years',
      hostStar: 'Kepler-186 (M-dwarf)',
      orbitalPeriod: '130 days',
      temperature: '-85°C to -50°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2014,
      description: 'First Earth-sized exoplanet confirmed in the habitable zone of another star.',
      funFact: 'Its sun is cooler and redder than ours, so daylight would look orange-red.',
      position: [2, 1, -2],
      isClaimable: true,
      orbitalPeriodDays: 130
    },
    {
      id: 'proxima-centauri-b',
      name: 'Proxima Centauri b',
      distance: '4.24 light-years',
      hostStar: 'Proxima Centauri (M-dwarf)',
      orbitalPeriod: '11.2 days',
      temperature: '-39°C',
      discoveryMethod: 'Radial velocity',
      discoveryYear: 2016,
      description: 'The closest known exoplanet to Earth, orbiting the star closest to our Sun.',
      funFact: 'It receives stellar winds 2000 times stronger than Earth receives from the Sun.',
      position: [-3, 0, 1],
      isClaimable: true,
      orbitalPeriodDays: 11.2
    },
    {
      id: 'trappist-1e',
      name: 'TRAPPIST-1e',
      distance: '40 light-years',
      hostStar: 'TRAPPIST-1 (ultra-cool dwarf)',
      orbitalPeriod: '6.1 days',
      temperature: '-22°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2017,
      description: 'One of 7 Earth-sized worlds in the same system.',
      funFact: 'TRAPPIST-1 is the most Earth-like planetary system found so far.',
      position: [1, -2, 3],
      isClaimable: true,
      orbitalPeriodDays: 6.1
    },
    {
      id: 'trappist-1f',
      name: 'TRAPPIST-1f',
      distance: '40 light-years',
      hostStar: 'TRAPPIST-1 (ultra-cool dwarf)',
      orbitalPeriod: '9.2 days',
      temperature: '-54°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2017,
      description: 'Colder than Earth, but could have liquid water with greenhouse gases.',
      funFact: 'It receives about the same amount of light as Mars gets from the Sun.',
      position: [-1, 2, -1],
      isClaimable: true,
      orbitalPeriodDays: 9.2
    },
    {
      id: 'trappist-1g',
      name: 'TRAPPIST-1g',
      distance: '40 light-years',
      hostStar: 'TRAPPIST-1 (ultra-cool dwarf)',
      orbitalPeriod: '12.4 days',
      temperature: '-65°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2017,
      description: 'One of the largest in the system and could be ocean-rich.',
      funFact: 'It might have a thick atmosphere that could warm its surface significantly.',
      position: [3, 1, 2],
      isClaimable: true,
      orbitalPeriodDays: 12.4
    },
    {
      id: 'kepler-22b',
      name: 'Kepler-22b',
      distance: '620 light-years',
      hostStar: 'Kepler-22 (G-type)',
      orbitalPeriod: '290 days',
      temperature: '22°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2011,
      description: 'First planet discovered in the habitable zone of a Sun-like star.',
      funFact: 'It could be a mini-Neptune with a thick atmosphere rather than a rocky world.',
      position: [-2, -1, 0],
      isClaimable: false,
      orbitalPeriodDays: 290
    },
    {
      id: 'hd-209458-b',
      name: 'HD 209458 b (Osiris)',
      distance: '159 light-years',
      hostStar: 'HD 209458 (G-type)',
      orbitalPeriod: '3.5 days',
      temperature: '1000°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 1999,
      description: 'First exoplanet observed to transit its star.',
      funFact: 'Its atmosphere is evaporating into space, earning it the nickname "Osiris".',
      position: [0, 3, -3],
      isClaimable: false,
      orbitalPeriodDays: 3.5
    },
    {
      id: 'wasp-12b',
      name: 'WASP-12b',
      distance: '871 light-years',
      hostStar: 'WASP-12 (G-type)',
      orbitalPeriod: '1.1 days',
      temperature: '2500°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2008,
      description: 'Being torn apart by its star\'s gravity.',
      funFact: 'It\'s a "doomed planet" that will be completely consumed by its star.',
      position: [-3, 2, 1],
      isClaimable: false,
      orbitalPeriodDays: 1.1
    },
    {
      id: 'kepler-452b',
      name: 'Kepler-452b',
      distance: '1400 light-years',
      hostStar: 'Kepler-452 (G-type)',
      orbitalPeriod: '385 days',
      temperature: '-8°C to 60°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2015,
      description: 'Called "Earth\'s cousin" because it\'s in the habitable zone.',
      funFact: 'The system is 6 billion years old, so any life might have already evolved and gone extinct.',
      position: [2, -3, 0],
      isClaimable: true,
      orbitalPeriodDays: 385
    },
    {
      id: 'kepler-10b',
      name: 'Kepler-10b',
      distance: '564 light-years',
      hostStar: 'Kepler-10 (G-type)',
      orbitalPeriod: '0.8 days',
      temperature: '1833°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2011,
      description: 'First rocky planet confirmed by Kepler.',
      funFact: 'Surface temperatures are hot enough to melt rock into lava oceans.',
      position: [1, 0, 3],
      isClaimable: false,
      orbitalPeriodDays: 0.8
    },
    {
      id: '51-pegasi-b',
      name: '51 Pegasi b (Dimidium)',
      distance: '50 light-years',
      hostStar: '51 Pegasi (G-type)',
      orbitalPeriod: '4.2 days',
      temperature: '1000°C',
      discoveryMethod: 'Radial velocity',
      discoveryYear: 1995,
      description: 'First planet discovered around a Sun-like star.',
      funFact: 'A "Hot Jupiter" that shattered assumptions about planetary systems.',
      position: [-1, -2, -2],
      isClaimable: true,
      orbitalPeriodDays: 4.2
    },
    {
      id: 'gj-1214-b',
      name: 'GJ 1214 b',
      distance: '48 light-years',
      hostStar: 'GJ 1214 (M-dwarf)',
      orbitalPeriod: '1.6 days',
      temperature: '200°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2009,
      description: 'Nicknamed the "Water World".',
      funFact: 'It may be covered in oceans or have a thick steam atmosphere.',
      position: [3, -1, -1],
      isClaimable: true,
      orbitalPeriodDays: 1.6
    },
    {
      id: 'lhs-1140-b',
      name: 'LHS 1140 b',
      distance: '41 light-years',
      hostStar: 'LHS 1140 (M-dwarf)',
      orbitalPeriod: '25 days',
      temperature: '-7°C to -73°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2017,
      description: 'A rocky super-Earth in the habitable zone.',
      funFact: 'One of the best candidates for atmosphere studies with future telescopes.',
      position: [-2, 1, 2],
      isClaimable: true,
      orbitalPeriodDays: 25
    },
    {
      id: 'kepler-62f',
      name: 'Kepler-62f',
      distance: '1200 light-years',
      hostStar: 'Kepler-62 (K-type)',
      orbitalPeriod: '267 days',
      temperature: '-65°C to 0°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2013,
      description: '40% larger than Earth, likely has a cold climate.',
      funFact: 'Could be warmer if greenhouse gases trap heat in its atmosphere.',
      position: [0, 2, 1],
      isClaimable: false,
      orbitalPeriodDays: 267
    },
    {
      id: 'kepler-62e',
      name: 'Kepler-62e',
      distance: '1200 light-years',
      hostStar: 'Kepler-62 (K-type)',
      orbitalPeriod: '122 days',
      temperature: '-25°C to 25°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2013,
      description: 'Warmer sibling of Kepler-62f, possibly an ocean world.',
      funFact: 'It receives 20% more energy from its star than Earth gets from the Sun.',
      position: [2, 0, -3],
      isClaimable: true,
      orbitalPeriodDays: 122
    },
    {
      id: 'wasp-17b',
      name: 'WASP-17b',
      distance: '1000 light-years',
      hostStar: 'WASP-17 (F-type)',
      orbitalPeriod: '3.7 days',
      temperature: '1740°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2009,
      description: 'Twice the size of Jupiter and orbits backwards.',
      funFact: 'A cosmic oddball that spins opposite to its star\'s rotation.',
      position: [-3, -2, 3],
      isClaimable: false,
      orbitalPeriodDays: 3.7
    },
    {
      id: 'kepler-20e',
      name: 'Kepler-20e',
      distance: '950 light-years',
      hostStar: 'Kepler-20 (G-type)',
      orbitalPeriod: '6.1 days',
      temperature: '760°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2011,
      description: 'Slightly smaller than Earth, but too close to its star.',
      funFact: 'It\'s the smallest exoplanet whose radius has been measured.',
      position: [1, 3, 0],
      isClaimable: false,
      orbitalPeriodDays: 6.1
    },
    {
      id: 'kepler-20f',
      name: 'Kepler-20f',
      distance: '950 light-years',
      hostStar: 'Kepler-20 (G-type)',
      orbitalPeriod: '19.6 days',
      temperature: '430°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2011,
      description: 'Earth-sized planet in a system with mixed planet sizes.',
      funFact: 'Part of the first system found with both smaller and larger rocky planets.',
      position: [-1, 0, -1],
      isClaimable: false,
      orbitalPeriodDays: 19.6
    },
    {
      id: 'hd-189733-b',
      name: 'HD 189733 b',
      distance: '64 light-years',
      hostStar: 'HD 189733 (K-type)',
      orbitalPeriod: '2.2 days',
      temperature: '930°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2005,
      description: 'Appears deep blue like Earth but for deadly reasons.',
      funFact: 'Its blue color comes from glass particles that likely rain molten glass sideways.',
      position: [3, 2, -2],
      isClaimable: true,
      orbitalPeriodDays: 2.2
    },
    {
      id: 'toi-700-d',
      name: 'TOI-700 d',
      distance: '101 light-years',
      hostStar: 'TOI-700 (M-dwarf)',
      orbitalPeriod: '37 days',
      temperature: '-73°C to 27°C',
      discoveryMethod: 'Transit method',
      discoveryYear: 2020,
      description: 'One of the first Earth-sized planets in the habitable zone discovered by TESS.',
      funFact: 'A flagship discovery for NASA\'s TESS mission, proving the telescope\'s capabilities.',
      position: [0, -3, 2],
      isClaimable: true,
      orbitalPeriodDays: 37
    }
  ]);

  const handlePlanetClaim = (planetId: string, claimTime: number) => {
    setPlanets(prev => prev.map(planet => 
      planet.id === planetId 
        ? { ...planet, claimedBy: currentPlayer, claimTime }
        : planet
    ));

    setPlayers(prev => prev.map(player => 
      player.id === currentPlayer
        ? { ...player, planetsOwned: player.planetsOwned + 1 }
        : player
    ));

    setSelectedPlanet(null);
  };

  const handlePlanetClaimWithScore = (planetId: string, playerId: string, score: number) => {
    setPlanets(prev => prev.map(planet => 
      planet.id === planetId 
        ? { ...planet, claimedBy: playerId, claimTime: Date.now() }
        : planet
    ));

    setPlayers(prev => prev.map(player => 
      player.id === playerId
        ? { 
            ...player, 
            planetsOwned: player.planetsOwned + 1,
            totalScore: player.totalScore + score
          }
        : player
    ));

    setSelectedPlanet(null);
  };

  const handleStartChallenge = () => {
    // Handle challenge start logic here
    console.log('Challenge started for planet:', selectedPlanet?.name);
  };

  const handleCloseModal = () => {
    setSelectedPlanet(null);
  };

  const handleCloseTransitLearning = () => {
    setShowTransitLearning(false);
  };

  const currentPlayerObject = players.find(player => player.id === currentPlayer);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 z-20 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800/90 backdrop-blur-sm rounded-lg hover:bg-gray-700/90 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Analysis
        </button>
        
        <select
          value={currentPlayer}
          onChange={(e) => setCurrentPlayer(e.target.value)}
          className="px-3 py-2 bg-gray-800/90 backdrop-blur-sm rounded-lg border border-gray-600 text-white text-sm"
        >
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => setShowTransitLearning(true)}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600/90 backdrop-blur-sm rounded-lg hover:bg-blue-500/90 transition-colors text-sm"
        >
          <Info className="w-4 h-4" />
          Learn Transit
        </button>
      </div>

      {/* 3D Universe */}
      <PlanetUniverse
        planets={planets}
        onPlanetClick={setSelectedPlanet}
        currentPlayer={currentPlayer}
        players={players}
      />

      {/* Leaderboard */}
      <Leaderboard players={players} />

      {/* Planet Claim Modal */}
      {selectedPlanet && (
        <PlanetClaimModal
          planet={selectedPlanet}
          currentPlayer={currentPlayerObject!}
          onClaimPlanet={handlePlanetClaimWithScore}
          onStartChallenge={handleStartChallenge}
          onClose={handleCloseModal}
        />
      )}

      {/* Transit Learning Modal */}
      {showTransitLearning && (
        <TransitLearning onClose={handleCloseTransitLearning} />
      )}
    </div>
  );
};

export default ExplorationPage;