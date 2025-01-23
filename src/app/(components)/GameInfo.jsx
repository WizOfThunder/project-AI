'use client';

export const GameInfo = ({ turn, uwongPieces, macanPieces, playerSide }) => (
  <div className={`game-info`}>
    <div className="player-status">
      <h3>You're playing as: {playerSide}</h3>
      <p>Opponent AI: {playerSide === 'uwong' ? 'Macan' : 'Uwong'}</p>
    </div>
    Turn: <span>{turn}</span> | 
    Uwong: <span>{uwongPieces}</span> | 
    Macan: <span>{macanPieces}</span>
  </div>
);