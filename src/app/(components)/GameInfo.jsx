'use client';

export const GameInfo = ({ turn, uwongPieces, macanPieces, className }) => (
  <div className={`game-info ${className}`}>
    Turn: <span>{turn}</span> | 
    Uwong: <span>{uwongPieces}</span> | 
    Macan: <span>{macanPieces}</span>
  </div>
);