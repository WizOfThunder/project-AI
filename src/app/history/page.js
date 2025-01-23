'use client';

import { HISTORY_KEY } from '@/lib/constants';
import { useState, useEffect } from 'react';
import { GameHistory } from '@/app/(components)/GameHistory';
import { ChevronDown, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function HistoryPage() {
 const [games, setGames] = useState([]);
 const [openGameIndex, setOpenGameIndex] = useState(null);
 const router = useRouter();

 useEffect(() => {
   const savedGames = localStorage.getItem(HISTORY_KEY);
   if (savedGames) {
     setGames(JSON.parse(savedGames));
   }
 }, []);

 return (
  <body style={{
    backgroundImage: "url('/assets/background-macan.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}>
    <div className="bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-8 sticky top-0 bg-gray-100 py-4 z-10">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Kembali ke Game</span>
          </button>
          <h1 className="text-3xl font-bold text-black">Macanan Game History</h1>
        </div>
        
        <div className="container mx-auto pb-8">
          {games.length === 0 ? (
            <div className="text-center text-gray-500 text-lg">No game history yet</div>
          ) : (
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-4">
              {games.map((game, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <button
                    onClick={() => setOpenGameIndex(openGameIndex === index ? null : index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="text-lg font-semibold text-black">Game #{games.length - index}</div>
                      <div className="text-sm text-gray-500">
                        <span>{game.date}</span>
                        <span className="mx-2">·</span>
                        <span>{game.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className={`font-bold ${
                          game.winner === 'macan' ? 'text-orange-600' : 'text-emerald-600'
                        }`}>
                          {game.winner === 'macan' ? '🐅 Macan Victory!' : '🛡️ Uwong Victory!'}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Moves: {game.moves.length}
                        </div>
                      </div>
                      <ChevronDown 
                        className={`w-5 h-5 transition-transform duration-300 ${
                          openGameIndex === index ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </button>
                  
                  <div className={`transition-all duration-300 ${
                    openGameIndex === index ? 'max-h-[2000px]' : 'max-h-0'
                  } overflow-hidden`}>
                    <div className="p-6 border-t overflow-y-auto max-h-[70vh]">
                      <GameHistory 
                        history={game.moves} 
                        winner={game.winner} 
                        showLeaderboard={true} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
   </body>
 );
}