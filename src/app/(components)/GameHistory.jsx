import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Trophy, Clock, Gamepad } from 'lucide-react';

const GameSummary = ({ winner }) => (
  <div className={`mb-6 p-6 rounded-xl ${
    winner === 'macan' ? 'bg-gradient-to-br from-orange-50 to-orange-100' : 'bg-gradient-to-br from-emerald-50 to-emerald-100'
  } border-2 ${winner === 'macan' ? 'border-orange-300' : 'border-emerald-300'} shadow-lg`}>
    <div className="flex items-center gap-3 mb-3">
      <Trophy className={`w-8 h-8 ${winner === 'macan' ? 'text-orange-600' : 'text-emerald-600'}`} />
      <h4 className="text-2xl font-bold text-gray-800">Victory!</h4>
    </div>
    <div className={`text-3xl font-bold mb-3 ${
      winner === 'macan' ? 'text-orange-600' : 'text-emerald-600'
    }`}>
      {winner === 'macan' ? '🐅 Macan Wins!' : '🛡️ Uwong Wins!'}
    </div>
    <div className="flex items-center gap-2 text-gray-600">
      <Clock className="w-4 h-4" />
      <span>{new Date().toLocaleTimeString()}</span>
    </div>
  </div>
);

const Move = ({ move, type, timestamp }) => (
  <div className={`mb-4 p-4 rounded-xl border-2 ${
    type === 'ai' ? 'bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200' : 'bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200'
  } hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1`}>
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Gamepad className={`w-5 h-5 ${
          type === 'ai' ? 'text-blue-600' : 'text-emerald-600'
        }`} />
        <span className={`font-bold text-lg ${
          type === 'ai' ? 'text-blue-800' : 'text-emerald-800'
        }`}>
          {type === 'ai' ? '🤖 Macan' : '👤 Uwong'}
        </span>
      </div>
      <div className="flex items-center gap-2 text-gray-500">
        <Clock className="w-4 h-4" />
        <span className="text-sm">
          {timestamp || new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
    <div className="mt-3 text-base text-gray-700 font-medium">
      {type === 'ai' ? 
        `🎯 Position: ${move.macanPos ?? 'Initial Position'}` : 
        `🎮 Remaining Pieces: ${move.uwongPieces}`
      }
    </div>
    {move.isFirst && (
      <div className="mt-2 text-sm text-gray-500 italic flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gray-400"></div>
        Initial placement
      </div>
    )}
  </div>
);

export const GameHistory = ({ history, winner, showLeaderboard = false }) => {
  const router = useRouter();

  if (showLeaderboard) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <button
          onClick={() => router.push('/')}
          className="mb-6 flex items-center gap-2 px-5 py-2.5 text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Kembali ke Game</span>
        </button>
        
        {winner && <GameSummary winner={winner} />}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Gamepad className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Macan (AI)
              </h3>
            </div>
            <div className="space-y-4">
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
          
          <div className="bg-white p-8 rounded-xl shadow-xl border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <Gamepad className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">
                Uwong (Player)
              </h3>
            </div>
            <div className="space-y-4">
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
    <div className="fixed right-4 top-4 w-80 bg-white rounded-xl shadow-2xl p-5 border border-gray-100">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold text-gray-800">Game History</h3>
        </div>
        <button 
          onClick={() => router.push('/history')}
          className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg"
        >
          Full History
        </button>
      </div>
      {winner && <GameSummary winner={winner} />}
      <div className="max-h-[calc(100vh-200px)] overflow-y-auto pr-2 space-y-4">
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