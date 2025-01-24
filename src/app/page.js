"use client";
import { SAVE_KEY } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import Image from "next/image";
import { SoundContext } from "@/context/SoundContext";

export default function StartMenu() {
  const router = useRouter();
  const [showResumeDialog, setShowResumeDialog] = useState(false);
  const [hasSavedGame, setHasSavedGame] = useState(false);
  // const { isSoundEnabled, setIsSoundEnabled } = useContext(SoundContext);

  // Cek apakah ada game yang tersimpan
  useEffect(() => {
    const savedGame = localStorage.getItem(SAVE_KEY);
    setHasSavedGame(!!savedGame && savedGame !== "undefined");
  }, []);

  const handlePlay = () => {
    // setIsSoundEnabled(true);
    if (hasSavedGame) {
      setShowResumeDialog(true);
    } else {
      router.push("/play");
    }
  };

  const handleNewGame = () => {
    // Hapus data yang tersimpan
    localStorage.removeItem(SAVE_KEY);
    sessionStorage.removeItem("gameSettings");
    router.push("/play");
  };

  const handleResume = () => {
    router.push("/play");
  };

  const handleLeaderboard = () => {
    // setIsSoundEnabled(true);
    router.push("/history");
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen w-screen text-white"
      style={{
        backgroundImage: "url('/assets/background-macan.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        className="bg-green-900/40 backdrop-blur-sm"
        style={{
          padding: "25vh 25vw",
          borderRadius: "1%",
          background:
            "linear-gradient(120deg, rgba(22, 101, 52, 0.6), rgba(20, 83, 45, 0.4))",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Image
          src="/assets/macanan_logo.png"
          alt="Logo"
          width={150}
          height={150}
          style={{ borderRadius: "10px", margin: "10px" }}
        />

        {/* Main Menu Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={handlePlay}
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-4 rounded border-4 border-blue-700 transition-all"
          >
            Play
          </button>
          <button
            onClick={handleLeaderboard}
            className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-4 rounded border-4 border-green-700 transition-all"
          >
            History
          </button>
        </div>

        {/* Resume Dialog */}
        {showResumeDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div className="bg-gray-700 p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-2xl font-bold mb-4">Resume Game?</h2>
              <p className="mb-6">
                We found a saved game. Would you like to continue where you left
                off?
              </p>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={handleNewGame}
                  className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-2 px-4 rounded border-2 border-red-700 transition-all"
                >
                  New Game
                </button>
                <button
                  onClick={handleResume}
                  className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white font-bold py-2 px-4 rounded border-2 border-green-700 transition-all"
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
