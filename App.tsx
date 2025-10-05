import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import ExplorationPage from './components/ExplorationPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/explore" element={<ExplorationPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;