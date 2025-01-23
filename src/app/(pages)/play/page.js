"use client";

import { useEffect, useState } from "react";
import { GameBoard } from "@/app/(components)/GameBoard";
import SelectSide from "@/app/(components)/SelectSide";
import { SAVE_KEY } from "@/lib/constants";

export default function Play() {
  const [gameSettings, setGameSettings] = useState(null);
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    // Check for existing save when component mounts
    const savedGame = localStorage.getItem(SAVE_KEY);
    setHasSave(!!savedGame && savedGame !== 'undefined');
  }, []);

  const handleSideSelected = (selectedSide, aiDepth) => {
    // Save initial settings
    const settings = {
      playerSide: selectedSide,
      aiDepth: aiDepth,
      isUwongAI: selectedSide === "macan",
      isMacanAI: selectedSide === "uwong"
    };
    
    // Store settings in session storage (not in main save)
    sessionStorage.setItem('gameSettings', JSON.stringify(settings));
    setGameSettings(settings);
  };

  const handleResetGame = () => {
    // Clear all game-related storage
    localStorage.removeItem(SAVE_KEY);
    sessionStorage.removeItem('gameSettings');
    setGameSettings(null);
    setHasSave(false);
  };


  if (hasSave) {
    return <GameBoard />;
  }

  return (
    <div className="min-h-screen w-full">
      {!gameSettings ? (
        <SelectSide onConfirm={handleSideSelected} />
      ) : (
        <GameBoard 
          onReset={handleResetGame}
        />
      )}
    </div>
  );
}