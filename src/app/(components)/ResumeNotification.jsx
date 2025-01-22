'use client';

import { INITIAL_STATE, SAVE_KEY } from "@/lib/constants";
import { useEffect, useState } from "react";

export const ResumeNotification = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const savedGame = localStorage.getItem(SAVE_KEY);
    if (savedGame) {
      const parsed = JSON.parse(savedGame);
      const isInitial = JSON.stringify(parsed.boardState) === JSON.stringify(INITIAL_STATE.board);
      
      if (!isInitial) {
        setShowBanner(true);
        const timer = setTimeout(() => setShowBanner(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return showBanner ? (
    <div className="resume-banner">
      Game saved! You can resume your last session.
    </div>
  ) : null;
};

