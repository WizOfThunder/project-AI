'use client';
import { SAVE_KEY } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function StartMenu() {
  const router = useRouter();
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);

  useEffect(() => {
    // Check for existing saved game on mount
    const savedGame = localStorage.getItem(SAVE_KEY);
    setHasSavedGame(!!savedGame && savedGame !== 'undefined');
  }, []);

  const handlePlay = () => {
    if (hasSavedGame) {
      setShowResumeDialog(true);
    } else {
      router.push('/play');
    }
  };

  const handleResume = () => {
    router.push('/play');
  };

  const handleNewGame = () => {
    // Clear existing save
    localStorage.removeItem(SAVE_KEY);
    router.push('/play');
  };

  const handleLeaderboard = () => {
    router.push('/leaderboard');
  };

  const handleExit = () => {
    // Implement proper exit logic for your app
    window.close(); // Note: Only works in some environments
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-screen text-white"
        style={{
          backgroundImage: "url('/assets/macanan_background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
    >
      <div className='bg-gray-800' style={{padding: '30vh 30vw', borderRadius: '1%'}}>
        <h1 className="text-4xl font-bold mb-8">Macanan</h1>
        
        {/* Main Menu Buttons */}
        <div className="flex flex-col gap-4">
          <button 
            onClick={handlePlay}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Play
          </button>
          <button 
            onClick={handleLeaderboard}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Leaderboard
          </button>
          <button 
            onClick={handleExit}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all"
          >
            Exit
          </button>
        </div>

        {/* Resume Dialog */}
        {showResumeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Resume Game?</h2>
              <p className="mb-6">We found a saved game. Would you like to continue where you left off?</p>
              
              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleNewGame}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-all"
                >
                  New Game
                </button>
                <button
                  onClick={handleResume}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-all"
                >
                  Resume
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}