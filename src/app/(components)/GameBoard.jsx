"use client";

import { useState, useEffect } from "react";
import {
  NODES,
  CONNECTIONS,
  GRID_SIZE,
  DIRECTIONS,
  adjacencyList,
  SAVE_KEY,
  INITIAL_STATE,
} from "@/lib/constants";
import {
  isValidSquareStart,
  getSquareIndices,
  indicesAreValid,
} from "@/lib/gameLogic";
import { Node } from "./Node";
import { GameInfo } from "./GameInfo";
import { useRouter } from "next/navigation";
import { ResumeNotification } from "./ResumeNotification";
import { getMacanMoves, minimax } from "@/lib/AILogic";
import { GameHistory } from "./GameHistory";

export const GameBoard = () => {
  const [boardState, setBoardState] = useState(Array(NODES.length).fill(null));
  const [turn, setTurn] = useState("uwong");
  const [uwongPiecesRemaining, setUwongPiecesRemaining] = useState(21);
  const [macanPosition, setMacanPosition] = useState(null);
  const [highlightedSquareIndices, setHighlightedSquareIndices] = useState([]);
  const [isFirstUwongTurn, setIsFirstUwongTurn] = useState(true);
  const [selectedUwongPiece, setSelectedUwongPiece] = useState(null);
  const [winner, setWinner] = useState(null);
  const [history, setHistory] = useState([INITIAL_STATE]);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (turn === "uwong") {
      if (isFirstUwongTurn) {
        const validIndices = highlightedSquareIndices.filter((index) =>
          isValidSquareStart(index, GRID_SIZE)
        );
        setHighlightedSquareIndices(validIndices);
      } else if (uwongPiecesRemaining === 0) {
        if (selectedUwongPiece !== null) {
          // Highlight adjacent empty nodes for selected piece
          const moves = adjacencyList[selectedUwongPiece].filter(
            (i) => boardState[i] === null
          );
          setHighlightedSquareIndices(moves);
        } else {
          setHighlightedSquareIndices([]);
        }
      }
    }
  }, [turn, isFirstUwongTurn, uwongPiecesRemaining, boardState]);

  useEffect(() => {
    // Check Macan win condition
    const totalUwongPieces =
      boardState.filter((piece) => piece === "uwong").length +
      uwongPiecesRemaining;
    if (totalUwongPieces < 14) {
      setWinner("macan");
    }
  }, [boardState, uwongPiecesRemaining]);

  useEffect(() => {
    // Check Uwong win condition (only when it's Macan's turn)
    if (turn === "macan" && macanPosition !== null && !winner) {
      const canMove = checkMacanCanMove();
      if (!canMove) {
        setWinner("uwong");
      }
    }
  }, [turn, boardState, macanPosition]);

  useEffect(() => {
    if (!isGameInInitialState()) {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({
          boardState,
          turn,
          uwongPiecesRemaining,
          macanPosition,
          isFirstUwongTurn,
          selectedUwongPiece,
          winner, // Ensure this is saved
          history,
          timestamp: new Date().toLocaleTimeString(),
        })
      );
    }
  }, [
    boardState,
    turn,
    uwongPiecesRemaining,
    macanPosition,
    isFirstUwongTurn,
    selectedUwongPiece,
    winner,
    history,
  ]);

  useEffect(() => {
    const savedGame = localStorage.getItem(SAVE_KEY);
    if (savedGame) {
      const {
        boardState: savedBoard,
        turn: savedTurn,
        uwongPiecesRemaining: savedUwong,
        macanPosition: savedMacan,
        isFirstUwongTurn: savedFirstTurn,
        selectedUwongPiece: savedSelected,
        winner: savedWinner,
        history: savedHistory,
      } = JSON.parse(savedGame);

      setBoardState(savedBoard);
      setTurn(savedTurn);
      setUwongPiecesRemaining(savedUwong);
      setMacanPosition(savedMacan);
      setIsFirstUwongTurn(savedFirstTurn);
      setSelectedUwongPiece(savedSelected);
      setWinner(savedWinner);
      setHistory(savedHistory);
    }
  }, []);

  const isGameInInitialState = () => {
    return (
      JSON.stringify(boardState) === JSON.stringify(INITIAL_STATE.board) &&
      turn === INITIAL_STATE.turn &&
      uwongPiecesRemaining === INITIAL_STATE.uwongPieces &&
      macanPosition === INITIAL_STATE.macanPos &&
      isFirstUwongTurn === INITIAL_STATE.isFirst &&
      selectedUwongPiece === null &&
      winner === null &&
      history.length === 1
    );
  };

  const switchTurn = (piecesPlaced) => {
    if (turn === "uwong") {
      if (piecesPlaced < (isFirstUwongTurn ? 9 : 1) && uwongPiecesRemaining > 0)
        return;
      setTurn("macan");
      if (isFirstUwongTurn) setIsFirstUwongTurn(false);
    } else {
      setTurn("uwong");
    }
  };

  const placeSquare = (index) => {
    if (!isValidSquareStart(index, GRID_SIZE)) return;

    const indices = getSquareIndices(index, GRID_SIZE);
    // Check if at least one position is empty
    if (!indices.some((i) => boardState[i] === null)) return;
    const newBoardState = [...boardState];
    let piecesPlaced = 0;

    indices.forEach((i) => {
      if (newBoardState[i] === null) {
        newBoardState[i] = "uwong";
        piecesPlaced++;
      }
    });

    setHistory((prev) => [
      ...prev,
      {
        board: boardState,
        macanPos: macanPosition,
        uwongPieces: uwongPiecesRemaining,
        turn: turn,
        isFirst: isFirstUwongTurn,
        timestamp: new Date().toLocaleTimeString(),
        winner,
      },
    ]);

    setBoardState(newBoardState);
    setUwongPiecesRemaining((prev) => prev - piecesPlaced);
    setHighlightedSquareIndices([]); // Clear highlights after placement
    switchTurn(piecesPlaced);
  };

  const placeSingleUwong = (index) => {
    if (boardState[index] !== null) return;

    const newBoardState = [...boardState];
    newBoardState[index] = "uwong";

    setHistory((prev) => [
      ...prev,
      {
        board: boardState,
        macanPos: macanPosition,
        uwongPieces: uwongPiecesRemaining,
        turn: turn,
        isFirst: isFirstUwongTurn,
      },
    ]);

    setBoardState(newBoardState);
    setUwongPiecesRemaining((prev) => prev - 1);
    switchTurn(1);
  };

  const tryMacanJump = (targetIndex) => {
    if (macanPosition === null || boardState[targetIndex] !== null) return;
    // Improved direction functions that match original game connections

    let bestJump = {
      captured: 0,
      path: [],
      target: null,
    };

    // Check all possible directions
    DIRECTIONS.forEach((dirFn) => {
      let current = macanPosition;
      const path = [];
      let captured = 0;

      while (true) {
        const next = dirFn(current);

        if (next === undefined || next === null || next === false || next < 0)
          break;

        // Check if next node has an Uwong piece
        if (boardState[next] === "uwong") {
          captured++;
          path.push(next);
          current = next;
        }
        // Check if we can land on an empty space after capturing
        else if (boardState[next] === null && captured > 0) {
          if (next === targetIndex && captured % 2 === 1) {
            path.push(next);
            if (captured > bestJump.captured) {
              bestJump = { captured, path: [...path], target: next };
            }
          }
          break;
        } else {
          break;
        }
      }
    });

    if (bestJump.captured > 0) {
      const newBoardState = [...boardState];

      // Remove captured pieces
      bestJump.path.slice(0, -1).forEach((i) => {
        newBoardState[i] = null;
      });

      // Move Macan to target position
      newBoardState[macanPosition] = null;
      newBoardState[bestJump.target] = "macan";

      setHistory((prev) => [
        ...prev,
        {
          board: boardState,
          macanPos: macanPosition,
          uwongPieces: uwongPiecesRemaining,
          turn: turn,
          isFirst: isFirstUwongTurn,
        },
      ]);

      setBoardState(newBoardState);
      setMacanPosition(bestJump.target);
      alert(`Macan captured ${bestJump.captured} Uwong pieces!`);
      switchTurn(0);
      return;
    }

    // Regular move if no jumps available
    if (adjacencyList[macanPosition].includes(targetIndex)) {
      const newBoardState = [...boardState];
      newBoardState[macanPosition] = null;
      newBoardState[targetIndex] = "macan";
      setHistory((prev) => [
        ...prev,
        {
          board: boardState,
          macanPos: macanPosition,
          uwongPieces: uwongPiecesRemaining,
          turn: turn,
          isFirst: isFirstUwongTurn,
        },
      ]);
      setBoardState(newBoardState);
      setMacanPosition(targetIndex);
      switchTurn(0);
    }
  };

  const checkMacanCanMove = () => {
    // Check adjacent moves
    const adjacentMoves = adjacencyList[macanPosition].some(
      (index) => boardState[index] === null
    );
    if (adjacentMoves) return true;

    // Check possible jumps
    const hasValidJump = DIRECTIONS.some((dirFn) => {
      let current = macanPosition;
      let captured = 0;

      while (true) {
        const next = dirFn(current);
        if (next === undefined || next === null || next < 0) break;

        if (boardState[next] === "uwong") {
          captured++;
          current = next;
        } else if (boardState[next] === null) {
          if (captured > 0 && captured % 2 === 1) return true;
          break;
        } else {
          break;
        }
      }
      return false;
    });

    return hasValidJump;
  };

  const handleNodeClick = (index) => {
    if (winner) return;
    if (turn === "uwong") {
      if (uwongPiecesRemaining > 0) {
        if (isFirstUwongTurn) {
          placeSquare(index);
        } else {
          placeSingleUwong(index);
        }
      } else {
        if (selectedUwongPiece === index) {
          // Clicking selected piece again cancels selection
          setSelectedUwongPiece(null);
        } else if (boardState[index] === "uwong") {
          // Select new piece
          setSelectedUwongPiece(index);
        } else if (selectedUwongPiece !== null) {
          // Move logic
          if (
            adjacencyList[selectedUwongPiece].includes(index) &&
            boardState[index] === null
          ) {
            const newBoardState = [...boardState];
            newBoardState[selectedUwongPiece] = null;
            newBoardState[index] = "uwong";
            setHistory((prev) => [
              ...prev,
              {
                board: boardState,
                macanPos: macanPosition,
                uwongPieces: uwongPiecesRemaining,
                turn: turn,
                isFirst: isFirstUwongTurn,
              },
            ]);
            setBoardState(newBoardState);
            setSelectedUwongPiece(null);
            switchTurn(0);
          }
        }
      }
    } else if (turn === "macan") {
      if (macanPosition === null) {
        // Place Macan for the first time
        if (boardState[index] === null) {
          const newBoardState = [...boardState];
          newBoardState[index] = "macan";
          setHistory((prev) => [
            ...prev,
            {
              board: boardState,
              macanPos: macanPosition,
              uwongPieces: uwongPiecesRemaining,
              turn: turn,
              isFirst: isFirstUwongTurn,
            },
          ]);
          setBoardState(newBoardState);
          setMacanPosition(index);
          switchTurn(0);
        }
      } else {
        // Handle Macan movement or jump
        tryMacanJump(index);
      }
    }
  };

  const executeMove = (bestMove) => {
    const newBoardState = [...boardState];
    let newMacanPosition = macanPosition;
    if (macanPosition === null) {
      newBoardState[bestMove.to] = "macan";
      newMacanPosition = bestMove.to;
    } else {
      newBoardState[macanPosition] = null;
      newBoardState[bestMove.to] = "macan";
      if (bestMove.type === "jump") {
        bestMove.path.forEach((i) => (newBoardState[i] = null));
      }
      newMacanPosition = bestMove.to;
    }

    setBoardState(newBoardState);
    setMacanPosition(newMacanPosition);
  };

  const makeAIMove = () => {
    const possibleMoves = getMacanMoves(boardState, macanPosition);
    let bestValue = -Infinity;
    let bestMove = null;

    possibleMoves.forEach((move, index) => {
      const newBoard = [...boardState];
      let newMacanPosition = macanPosition;

      if (macanPosition === null) {
        newBoard[move.to] = "macan";
        newMacanPosition = move.to;
      } else if (move.type === "jump") {
        move.path.forEach((i) => (newBoard[i] = null));
      }

      newBoard[macanPosition] = null;
      newBoard[newMacanPosition] = "macan";

      // Pass required parameters to minimax
      const moveValue = minimax(
        newBoard,
        newMacanPosition,
        uwongPiecesRemaining, // From component state
        isFirstUwongTurn, // From component state
        5, // Depth
        -Infinity,
        Infinity,
        false
      );

      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      } else if (index == 0) {
        bestMove = move;
      }
    });

    // Execute the best move
    if (bestMove) {
      executeMove(bestMove);
      setHistory((prev) => [
        ...prev,
        {
          board: boardState,
          macanPos: macanPosition,
          uwongPieces: uwongPiecesRemaining,
          turn: turn,
          isFirst: isFirstUwongTurn,
        },
      ]);
      switchTurn(0);
    }
  };

  // Add useEffect to trigger AI move
  useEffect(() => {
    if (turn === "macan" && !winner) {
      const delay = setTimeout(() => {
        makeAIMove();
      }, 1000); // Add 1s delay for "thinking"
      return () => clearTimeout(delay);
    }
  }, [turn, boardState, macanPosition]);

  useEffect(() => {
    if (winner) {
      const existingGames = JSON.parse(
        localStorage.getItem(HISTORY_KEY) || "[]"
      );
      const newGame = {
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        winner,
        moves: history,
        totalMoves: history.length,
        totalUwongPieces: boardState.filter((piece) => piece === "uwong")
          .length,
        macanCaptures:
          21 -
          (boardState.filter((piece) => piece === "uwong").length +
            uwongPiecesRemaining),
      };
      localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify([...existingGames, newGame])
      );
    }
  }, [winner]);

  const handleUndo = () => {
    if (history.length > 1) {
      const previousState = history[history.length - 2];
      setBoardState(previousState.board);
      setMacanPosition(previousState.macanPos);
      setUwongPiecesRemaining(previousState.uwongPieces);
      setTurn(previousState.turn);
      setIsFirstUwongTurn(previousState.isFirst);
      setHistory((prev) => prev.slice(0, -1));
      setWinner(null);
    }
  };

  const handleReset = () => {
    localStorage.removeItem(SAVE_KEY);
    setBoardState(INITIAL_STATE.board);
    setTurn(INITIAL_STATE.turn);
    setUwongPiecesRemaining(INITIAL_STATE.uwongPieces);
    setMacanPosition(INITIAL_STATE.macanPos);
    setIsFirstUwongTurn(INITIAL_STATE.isFirst);
    setSelectedUwongPiece(null);
    setWinner(null);
    setHistory([INITIAL_STATE]);
  };

  const handleQuit = (forceQuit = false) => {
    if (!forceQuit && !winner && !isGameInInitialState()) {
      setShowQuitConfirm(true);
    } else {
      if (winner) {
        localStorage.removeItem(SAVE_KEY);
      }
      router.push("/");
    }
  };
  return (
    <div className="game-container">
      <ResumeNotification />

      {showQuitConfirm && (
        <div className="confirmation-overlay">
          <div className="confirmation-modal">
            <h3>Save and Quit?</h3>
            <p>Your current progress will be saved. You can resume later.</p>
            <div className="confirmation-buttons">
              <button
                className="button confirm-button"
                onClick={() => handleQuit(true)}
              >
                Save & Quit
              </button>
              <button
                className="button cancel-button"
                onClick={() => setShowQuitConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Winner overlay */}
      {winner && (
        <div className="winner-overlay">
          <div className="winner-content">
            <h2 className={`winner-title ${winner}-win`}>
              {winner === "macan" ? "🐅 Macan Wins!" : "🛡️ Uwong Wins!"}
            </h2>
            <div className="winner-buttons">
              <button className="button restart-button" onClick={handleReset}>
                Play Again
              </button>
              <button
                className="button quit-button"
                onClick={() => handleQuit()}
              >
                Quit Game
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game controls */}
      <div className="game-controls">
        <button
          onClick={handleUndo}
          disabled={history.length <= 1}
          className="button undo-button"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h10a8 8 0 018 8v2M3 10l-3 3m0 0l3 3"
            />
          </svg>
          Undo
        </button>
        <button onClick={handleReset} className="button reset-button">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reset
        </button>
        <button onClick={() => handleQuit()} className="button quit-button">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Quit
        </button>
      </div>

      {/* Game info */}
      <GameInfo
        turn={turn}
        uwongPieces={uwongPiecesRemaining}
        macanPieces={macanPosition !== null ? 0 : 1}
        className="game-info"
      />

      <GameHistory history={history} winner={winner} />

      {/* Game board */}
      <div className="network">
        {CONNECTIONS.map(([from, to], idx) => (
          <div
            key={`conn-${idx}`}
            className="line"
            style={{
              width: `${Math.hypot(
                NODES[to].x - NODES[from].x,
                NODES[to].y - NODES[from].y
              )}px`,
              left: `${NODES[from].x}px`,
              top: `${NODES[from].y}px`,
              transform: `rotate(${Math.atan2(
                NODES[to].y - NODES[from].y,
                NODES[to].x - NODES[from].x
              )}rad)`,
            }}
          />
        ))}

        {NODES.map((pos, index) => (
          <Node
            key={`node-${index}`}
            position={pos}
            type={boardState[index]}
            isHighlighted={
              highlightedSquareIndices.includes(index) &&
              (indicesAreValid(
                highlightedSquareIndices,
                boardState,
                GRID_SIZE
              ) ||
                (uwongPiecesRemaining === 0 && selectedUwongPiece === index))
            }
            isSelected={selectedUwongPiece === index}
            onClick={() => handleNodeClick(index)}
            onHover={(isHovering) => {
              if (turn === "uwong" && isFirstUwongTurn) {
                if (isHovering) {
                  if (isValidSquareStart(index, GRID_SIZE)) {
                    const indices = getSquareIndices(index, GRID_SIZE);
                    const hasEmptySpots = indices.some(
                      (i) => boardState[i] === null
                    );

                    if (hasEmptySpots) {
                      setHighlightedSquareIndices(indices);
                      return;
                    }
                  }
                }
                setHighlightedSquareIndices([]);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
