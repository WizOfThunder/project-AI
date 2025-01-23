'use client';

import { HISTORY_KEY } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { GameHistory } from '@/app/(components)/GameHistory';

export default function HistoryPage() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const savedGames = localStorage.getItem(HISTORY_KEY);
    if (savedGames) {
      setGames(JSON.parse(savedGames));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Macanan Game History</h1>
        
        {games.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">No game history yet</div>
        ) : (
          <div className="space-y-8">
            {games.map((game, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-6 border-b pb-4">
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">Game #{games.length - index}</div>
                    <div className="text-sm text-gray-500">
                      <span>{game.date}</span>
                      <span className="mx-2">·</span>
                      <span>{game.time}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`text-xl font-bold ${
                      game.winner === 'macan' ? 'text-orange-600' : 'text-emerald-600'
                    }`}>
                      {game.winner === 'macan' ? '🐅 Macan Victory!' : '🛡️ Uwong Victory!'}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Total Moves: {game.moves.length}
                    </div>
                  </div>
                </div>
                <GameHistory history={game.moves} winner={game.winner} showLeaderboard={true} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}