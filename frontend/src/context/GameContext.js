import React, { createContext, useState, useContext } from 'react';

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [score, setScore] = useState(0);
  const [targetPlayer, setTargetPlayer] = useState(null);
  const [difficulty, setDifficulty] = useState(null);

  // Helper functions to manage score across screens
  const addScore = (points) => setScore(prev => prev + points);
  const resetScore = () => setScore(0);

  return (
    <GameContext.Provider value={{
      score, addScore, resetScore,
      targetPlayer, setTargetPlayer,
      difficulty, setDifficulty
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
