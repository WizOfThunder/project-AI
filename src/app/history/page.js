'use client';

import { SAVE_KEY } from '@/lib/constants';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { GameHistory } from '@/app/(components)/GameHistory';

export default function History() {
  const [history, setHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const savedGame = localStorage.getItem(SAVE_KEY);
    if (savedGame) {
      const { history: gameHistory } = JSON.parse(savedGame);
      setHistory(gameHistory || []);
    }
  }, []);

  return <GameHistory history={history} showLeaderboard={true} />;
}