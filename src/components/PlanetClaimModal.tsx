import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Thermometer, MapPin, Star, Trophy, Play, CheckCircle, XCircle } from 'lucide-react';
import type { Planet, Player, QuizQuestion } from './ExplorationPage';

interface PlanetClaimModalProps {
  planet: Planet;
  currentPlayer: Player;
  onClose: () => void;
  onStartChallenge: (planet: Planet) => void;
  onClaimPlanet: (planetId: string, playerId: string, score: number) => void;
}

const PlanetClaimModal: React.FC<PlanetClaimModalProps> = ({ 
  planet, 
  currentPlayer, 
  onClose, 
  onStartChallenge,
  onClaimPlanet 
}) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalTime, setTotalTime] = useState<number>(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);

  // Generate quiz questions based on planet data
  const generateQuizQuestions = (planet: Planet): QuizQuestion[] => {
    // Base 4 questions that every planet gets
    const baseQuestions: QuizQuestion[] = [
      {
        question: `What discovery method was used to find ${planet.name}?`,
        options: ['Transit method', 'Radial velocity', 'Direct imaging', 'Gravitational microlensing'],
        correctAnswer: planet.discoveryMethod === 'Transit method' ? 0 : 
                      planet.discoveryMethod === 'Radial velocity' ? 1 : 2,
        explanation: `${planet.name} was discovered using the ${planet.discoveryMethod} method.`
      },
      {
        question: `What is the approximate orbital period of ${planet.name}?`,
        options: [
          `${planet.orbitalPeriodDays} days`,
          `${Math.round(planet.orbitalPeriodDays * 2.5)} days`,
          `${Math.round(planet.orbitalPeriodDays / 3)} days`,
          `${Math.round(planet.orbitalPeriodDays * 0.7)} days`
        ],
        correctAnswer: 0,
        explanation: `${planet.name} has an orbital period of ${planet.orbitalPeriodDays} days.`
      },
      {
        question: `What makes ${planet.name} special?`,
        options: [
          'It has rings like Saturn',
          planet.funFact,
          'It orbits a binary star system',
          'It has multiple moons'
        ],
        correctAnswer: 1,
        explanation: planet.funFact
      },
      {
        question: `In what year was ${planet.name} discovered?`,
        options: [
          `${planet.discoveryYear - 2}`,
          `${planet.discoveryYear + 1}`,
          `${planet.discoveryYear}`,
          `${planet.discoveryYear - 5}`
        ],
        correctAnswer: 2,
        explanation: `${planet.name} was discovered in ${planet.discoveryYear}.`
      }
    ];

    // Return exactly 4 questions - no more, no less
    return baseQuestions;
  };

  const quizQuestions = generateQuizQuestions(planet);

  const handleStartQuiz = () => {
    setShowQuiz(true);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
    onStartChallenge(planet);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    const questionTime = Date.now() - questionStartTime;
    let currentScore = score;
    if (selectedAnswer === quizQuestions[currentQuestion].correctAnswer) {
      currentScore = score + 10;
      setScore(currentScore);
    }
    
    setShowResult(true);
    
    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setQuestionStartTime(Date.now());
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        const finalTime = Date.now() - startTime;
        const finalScore = currentScore;
        setTotalTime(finalTime);
        setQuizComplete(true);
        
        // Only auto-claim planet if score is 30 or higher (75%)
        if (finalScore >= 30) {
          setTimeout(() => {
            onClaimPlanet(planet.id, currentPlayer.id, finalScore);
            onClose();
          }, 2000);
        }
      }
    }, 2000);
  };

  const isCorrect = selectedAnswer === quizQuestions[currentQuestion]?.correctAnswer;

  // Format time display
  const formatTime = (ms: number) => {
    return `${Math.floor(ms / 1000)}s`;
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
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", duration: 0.5 }}
        className="glass-panel p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5 text-gray-400" />
        </button>

        {!showQuiz ? (
          // Planet Details View
          <>
            {/* Planet Info Header */}
            <div className="text-center mb-6">
              <motion.div
                className="inline-block relative"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${planet.color} shadow-lg mx-auto mb-4 relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute top-1/4 left-1/3 w-4 h-4 rounded-full bg-white/30" />
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 rounded-full bg-black/30" />
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 rounded-full bg-white/50" />
                  </div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-black/30" />
                </div>
                <div className={`absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br ${planet.color} blur-xl opacity-50 mx-auto`} />
              </motion.div>

              <h2 className="text-3xl font-bold orbitron text-yellow-400 mb-2">{planet.name}</h2>
              <p className="text-gray-400 text-sm mb-4">{planet.description}</p>
              
              {planet.claimedBy ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-400/30 rounded-full">
                  <Trophy className="w-4 h-4 text-red-400" />
                  <span className="text-red-400 font-medium">Already Claimed</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-400/30 rounded-full">
                  <Star className="w-4 h-4 text-green-400" />
                  <span className="text-green-400 font-medium">Ready for Challenge</span>
                </div>
              )}
            </div>

            {/* Planet Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-gray-700/50">
                <Clock className="w-6 h-6 text-blue-400" />
                <div>
                  <p className="text-sm text-gray-400">Orbital Period</p>
                  <p className="font-semibold text-white text-lg">{planet.orbitalPeriod} days</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-gray-700/50">
                <Thermometer className="w-6 h-6 text-red-400" />
                <div>
                  <p className="text-sm text-gray-400">Temperature</p>
                  <p className="font-semibold text-white text-lg">{planet.temperature} K</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-gray-700/50">
                <MapPin className="w-6 h-6 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">Distance</p>
                  <p className="font-semibold text-white text-lg">{planet.distance}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-black/20 rounded-lg border border-gray-700/50">
                <Star className="w-6 h-6 text-yellow-400" />
                <div>
                  <p className="text-sm text-gray-400">Host Star</p>
                  <p className="font-semibold text-white text-lg">{planet.star}</p>
                </div>
              </div>
            </div>

            {/* Fun Fact */}
            <div className="p-4 bg-yellow-900/20 border border-yellow-400/20 rounded-lg mb-6">
              <h4 className="font-semibold text-yellow-400 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Fun Fact
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">{planet.funFact}</p>
            </div>

            {/* Challenge Button */}
            {!planet.claimedBy ? (
              <div className="space-y-4">
                <div className="p-4 bg-blue-900/20 border border-blue-400/20 rounded-lg">
                  <h4 className="font-semibold text-blue-400 mb-2">Challenge Rules</h4>
                  <ul className="text-gray-300 text-sm space-y-1">
                    <li>• Answer 4 questions about this planet</li>
                    <li>• Minimum 30/40 points (75%) required to claim</li>
                    <li>• Planet becomes yours when claimed</li>
                  </ul>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartQuiz}
                  className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <Play className="w-6 h-6" />
                  Start Challenge
                </motion.button>
              </div>
            ) : (
              <div className="p-4 bg-red-900/20 border border-red-400/20 rounded-lg text-center">
                <p className="text-red-400 font-medium">This planet has already been claimed!</p>
              </div>
            )}
          </>
        ) : (
          // Quiz Interface
          <div className="min-h-[500px]">
            {!quizComplete ? (
              <>
                {/* Quiz Header with Timer */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold orbitron text-yellow-400 mb-2">
                    {planet.name} Challenge
                  </h3>
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>•</span>
                    <span>Time: {formatTime(Date.now() - startTime)}</span>
                    <span>•</span>
                    <span style={{ color: currentPlayer.color }}>{currentPlayer.name}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>

                {/* Question */}
                <div className="mb-8">
                  <h4 className="text-xl font-semibold text-white mb-6 leading-relaxed">
                    {quizQuestions[currentQuestion]?.question}
                  </h4>

                  {/* Answer Options */}
                  <div className="space-y-3">
                    {quizQuestions[currentQuestion]?.options.map((option, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswerSelect(index)}
                        disabled={selectedAnswer !== null}
                        className={`
                          w-full p-4 text-left rounded-lg border transition-all duration-300
                          ${selectedAnswer === index
                            ? showResult
                              ? isCorrect
                                ? 'bg-green-900/30 border-green-400 text-green-300'
                                : 'bg-red-900/30 border-red-400 text-red-300'
                              : 'bg-yellow-900/30 border-yellow-400 text-yellow-300'
                            : selectedAnswer !== null && index === quizQuestions[currentQuestion].correctAnswer && showResult
                              ? 'bg-green-900/30 border-green-400 text-green-300'
                              : 'bg-black/20 border-gray-600 text-gray-300 hover:border-gray-500 hover:bg-black/30'
                          }
                          ${selectedAnswer !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold
                            ${selectedAnswer === index
                              ? showResult
                                ? isCorrect
                                  ? 'border-green-400 bg-green-400 text-black'
                                  : 'border-red-400 bg-red-400 text-white'
                                : 'border-yellow-400 bg-yellow-400 text-black'
                              : selectedAnswer !== null && index === quizQuestions[currentQuestion].correctAnswer && showResult
                                ? 'border-green-400 bg-green-400 text-black'
                                : 'border-gray-500'
                            }
                          `}>
                            {selectedAnswer === index && showResult ? (
                              isCorrect ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
                            ) : selectedAnswer !== null && index === quizQuestions[currentQuestion].correctAnswer && showResult ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              String.fromCharCode(65 + index)
                            )}
                          </div>
                          <span>{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Result Explanation */}
                <AnimatePresence>
                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`p-4 rounded-lg border mb-6 ${
                        isCorrect 
                          ? 'bg-green-900/20 border-green-400/30' 
                          : 'bg-red-900/20 border-red-400/30'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                        <span className={`font-semibold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                          {isCorrect ? 'Correct!' : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">
                        {quizQuestions[currentQuestion]?.explanation}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Next Button */}
                {selectedAnswer !== null && !showResult && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Challenge'}
                  </motion.button>
                )}
              </>
            ) : (
              // Quiz Complete
              <div className="text-center py-8">
                {score >= 30 ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <Trophy className="w-12 h-12 text-black" />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6"
                  >
                    <XCircle className="w-12 h-12 text-white" />
                  </motion.div>
                )}
                
                <h3 className="text-3xl font-bold orbitron text-yellow-400 mb-4">
                  {score >= 30 ? 'Challenge Complete!' : 'Challenge Failed!'}
                </h3>
                
                <div className="space-y-2 mb-6">
                  <div className="text-2xl font-bold text-white">
                    Score: {score} / {quizQuestions.length * 10}
                  </div>
                  <div className="text-lg text-gray-300">
                    Completion Time: {formatTime(totalTime)}
                  </div>
                </div>
                
                <p className="text-gray-400 mb-6">
                  {score >= 30 
                    ? `Claiming ${planet.name} for ${currentPlayer.name}...`
                    : `Need at least 30/40 points to claim ${planet.name}. Try again!`
                  }
                </p>
                
                {score >= 30 && (
                  <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto" />
                )}
                
                {score < 30 && (
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition-colors"
                  >
                    Try Again
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default PlanetClaimModal;