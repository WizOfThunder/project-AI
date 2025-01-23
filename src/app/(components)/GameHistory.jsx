import React from "react";
import { useRouter } from "next/navigation";

const Move = ({ move, type }) => (
  <div
    className={`mb-2 p-2 rounded ${
      type === "ai" ? "bg-blue-100" : "bg-green-100"
    }`}
  >
    <div className="flex items-center gap-2">
      <span
        className={`font-medium ${
          type === "ai" ? "text-blue-700" : "text-green-700"
        }`}
      >
        {type === "ai" ? "🤖 Macan" : "👤 Uwong"}
      </span>
    </div>
    <div className="text-sm text-gray-600 mt-1">
      {type === "ai"
        ? `Position: ${move.macanPos ?? "Not placed"}`
        : `Pieces: ${move.uwongPieces}`}
    </div>
    {move.isFirst && (
      <div className="text-xs text-gray-500 mt-1">Initial placement</div>
    )}
  </div>
);

export const GameHistory = ({ history, showLeaderboard = false }) => {
  const router = useRouter();

  if (showLeaderboard) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Macan (AI) Moves</h3>
          <div className="space-y-2">
            {history
              .filter((state) => state.turn === "macan")
              .map((move, index) => (
                <Move key={index} move={move} type="ai" />
              ))}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Uwong (Player) Moves</h3>
          <div className="space-y-2">
            {history
              .filter((state) => state.turn === "uwong")
              .map((move, index) => (
                <Move key={index} move={move} type="player" />
              ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed right-4 top-4 w-64 bg-white rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Game History</h3>
        <button
          onClick={() => router.push("/history")}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All History
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {history.map((state, index) => (
          <Move
            key={index}
            move={state}
            type={state.turn === "macan" ? "ai" : "player"}
          />
        ))}
      </div>
    </div>
  );
};
export { GameHistory };
