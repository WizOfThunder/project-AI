import React from 'react';
import { useRouter } from 'next/navigation';

const GameSummary = ({ winner }) => (
  <div className={`mb-4 p-4 rounded-lg ${
    winner === 'macan' ? 'bg-orange-100' : 'bg-emerald-100'
  } border ${winner === 'macan' ? 'border-orange-200' : 'border-emerald-200'}`}>
    <h4 className="text-xl font-bold mb-2 text-gray-800">Final Result</h4>
    <div className={`text-2xl font-bold ${
      winner === 'macan' ? 'text-orange-600' : 'text-emerald-600'
    }`}>
      {winner === 'macan' ? '🐅 Macan Victory!' : '🛡️ Uwong Victory!'}
    </div>
    <div className="text-sm text-gray-700 mt-2">
      Game finished at {new Date().toLocaleTimeString()}
    </div>
  </div>
);

const Move = ({ move, type, timestamp }) => (
  <div className={`mb-3 p-3 rounded-lg border ${
    type === 'ai' ? 'bg-blue-50 border-blue-200' : 'bg-emerald-50 border-emerald-200'
  } hover:shadow-md transition-shadow duration-200`}>
    <div className="flex justify-between items-center">
      <span className={`font-semibold text-gray-800 text-lg ${
        type === 'ai' ? 'text-blue-800' : 'text-emerald-800'
      }`}>
        {type === 'ai' ? '🤖 Macan Move' : '👤 Uwong Move'}
      </span>
      <span className="text-sm text-gray-600">
        {timestamp || new Date().toLocaleTimeString()}
      </span>
    </div>
    <div className="text-base text-gray-700 mt-2">
      {type === 'ai' ? 
        `Position: ${move.macanPos ?? 'Not placed'}` : 
        `Remaining Pieces: ${move.uwongPieces}`
      }
    </div>
    {move.isFirst && (
      <div className="text-sm text-gray-600 mt-1 italic">
        Initial placement phase
      </div>
    )}
  </div>
);

export const GameHistory = ({ history, winner, showLeaderboard = false }) => {
  const router = useRouter();

  if (showLeaderboard) {
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {winner && <GameSummary winner={winner} />}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Macan (AI) Moves
            </h3>
            <div className="space-y-3">
              {history
                .filter(state => state.turn === 'macan')
                .map((move, index) => (
                  <Move 
                    key={index} 
                    move={move} 
                    type="ai" 
                    timestamp={move.timestamp}
                  />
                ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-gray-800">
              Uwong (Player) Moves
            </h3>
            <div className="space-y-3">
              {history
                .filter(state => state.turn === 'uwong')
                .map((move, index) => (
                  <Move 
                    key={index} 
                    move={move} 
                    type="player" 
                    timestamp={move.timestamp}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 w-72 bg-white rounded-lg shadow-xl p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">Game History</h3>
        <button 
          onClick={() => router.push('/history')}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Full History
        </button>
      </div>
      {winner && <GameSummary winner={winner} />}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {history.map((state, index) => (
          <Move 
            key={index} 
            move={state} 
            type={state.turn === 'macan' ? 'ai' : 'player'}
            timestamp={state.timestamp}
          />
        ))}
      </div>
    </div>
  );
};