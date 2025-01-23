"use client";
// src/context/SoundContext.js
import { createContext, useState, useEffect } from "react";
import { playSound } from "@/utils/sound";

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);

  useEffect(() => {
    if (isSoundEnabled) {
      const audioInstance = playSound("ambientJungle", 0.1, true); // Mulai suara dengan volume 0.1 dan loop
      return () => {
        if (audioInstance) {
          audioInstance.pause(); // Hentikan suara saat provider unmount
        }
      };
    }
  }, [isSoundEnabled]);

  return (
    <SoundContext.Provider value={{ isSoundEnabled, setIsSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
};
