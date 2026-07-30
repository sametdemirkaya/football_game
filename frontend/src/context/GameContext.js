import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [difficulty, setDifficulty] = useState(null);
  const [targetScore, setTargetScore] = useState(3); // Varsayılan hedef skor 3

  // Helper functions to manage score across screens
  const addScore = (points) => setScore(prev => prev + points);
  const resetScore = () => setScore(0);

  return (
    <GameContext.Provider value={{
      score, addScore, resetScore,
      targetPlayer, setTargetPlayer,
      difficulty, setDifficulty,
      targetScore, setTargetScore
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
