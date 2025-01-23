"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";
import { SAVE_KEY } from "@/lib/constants";

const COLORS = {
  macan: {
    primary: "#ff4d4d",
    text: "#ffffff",
  },
  uwong: {
    primary: "#2b2b7b",
    text: "#ffffff",
  },
};

const PLAYERS = {
  macan: {
    name: "Macan",
    image: "/assets/tiger_circle.png",
  },
  uwong: {
    name: "Uwong",
    image: "/assets/uwong_circle.png",
  },
};

export default function SelectSide({ onConfirm }) {
  const [selected, setSelected] = useState("macan"); // Menyimpan sisi yang dipilih
  const [confirmed, setConfirmed] = useState(false); // Menyimpan status apakah tombol "Select" sudah ditekan
  const [depth, setDepth] = useState(3); // Default depth value
  const [minDepth, setMinDepth] = useState(2); // Minimal depth value
  const [maxDepth, setMaxDepth] = useState(5); // Maximal depth value

  const handleSelect = (side) => {
    if (!confirmed) {
      setSelected(side);
    }
  };

  const handleConfirm = () => {
    setConfirmed(true); // Mengunci sisi yang dipilih dan expand sisi satunya
  };

  const handleCancel = () => {
    setConfirmed(false); // Kembali ke kondisi awal
  };

  const handleOk = () => {
    setConfirmed(false); // Kembali ke kondisi awal
    onConfirm(selected, depth);
    // Clear any existing game saves when starting new game
    localStorage.removeItem(SAVE_KEY);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="flex h-full">
        {/* Macan Side */}
        <motion.div
          className="relative flex-1 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: COLORS.macan.primary,
            clipPath: "polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)",
          }}
          animate={{
            flex:
              selected === "macan" && !confirmed
                ? 1.3 // Expand jika dipilih dan belum dikonfirmasi
                : selected === "uwong" && confirmed
                ? 1.3 // Expand sisi satunya setelah dikonfirmasi
                : 0.3, // Shrink untuk kondisi lainnya
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          onClick={() => handleSelect("macan")}
        >
          {/* Radial Burst Effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Darkening Overlay */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            animate={{
              opacity: selected === "uwong" && confirmed ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex flex-col items-center justify-center h-full gap-8 p-8">
            <motion.div
              className="w-48 h-48"
              animate={{
                scale: selected === "macan" && !confirmed ? 1.1 : 1,
                y: selected === "macan" && !confirmed ? -20 : 0,
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <img
                src={PLAYERS.macan.image || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{
                scale: selected === "macan" && !confirmed ? 1.1 : 1,
              }}
            >
              <h2
                className="text-5xl font-bold tracking-wider"
                style={{ color: COLORS.macan.text }}
              >
                {PLAYERS.macan.name}
              </h2>
              {selected === "macan" && !confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="secondary"
                    className="px-8 py-2 text-xl"
                    onClick={handleConfirm}
                  >
                    Select
                  </Button>
                </motion.div>
              )}
              {confirmed && selected === "uwong" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  <h2 className="text-3xl font-bold">Minimax Depth</h2>
                  <input
                    type="range"
                    min={minDepth}
                    max={maxDepth}
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value))}
                    className="w-64"
                  />
                  <span className="text-xl">{depth}</span>
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      className="px-8 py-2 text-xl"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="px-8 py-2 text-xl"
                      onClick={handleOk}
                    >
                      OK
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Uwong Side */}
        <motion.div
          className="relative flex-1 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: COLORS.uwong.primary,
            clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0 100%)",
          }}
          animate={{
            flex:
              selected === "uwong" && !confirmed
                ? 1.3 // Expand jika dipilih dan belum dikonfirmasi
                : selected === "macan" && confirmed
                ? 1.3 // Expand sisi satunya setelah dikonfirmasi
                : 0.3, // Shrink untuk kondisi lainnya
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          onClick={() => handleSelect("uwong")}
        >
          {/* Radial Burst Effect */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)",
            }}
          />

          {/* Darkening Overlay */}
          <motion.div
            className="absolute inset-0 bg-black pointer-events-none"
            animate={{
              opacity: selected === "macan" && confirmed ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex flex-col items-center justify-center h-full gap-8 p-8">
            <motion.div
              className="w-48 h-48"
              animate={{
                scale: selected === "uwong" && !confirmed ? 1.1 : 1,
                y: selected === "uwong" && !confirmed ? -20 : 0,
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <img
                src={PLAYERS.uwong.image || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{
                scale: selected === "uwong" && !confirmed ? 1.1 : 1,
              }}
            >
              <h2
                className="text-5xl font-bold tracking-wider"
                style={{ color: COLORS.uwong.text }}
              >
                {PLAYERS.uwong.name}
              </h2>
              {selected === "uwong" && !confirmed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="secondary"
                    className="px-8 py-2 text-xl"
                    onClick={handleConfirm}
                  >
                    Select
                  </Button>
                </motion.div>
              )}
              {confirmed && selected === "macan" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center gap-4"
                >
                  <h2 className="text-3xl font-bold">Minimax Depth</h2>
                  <input
                    type="range"
                    min={minDepth}
                    max={maxDepth}
                    value={depth}
                    onChange={(e) => setDepth(parseInt(e.target.value))}
                    className="w-64"
                  />
                  <span className="text-xl">{depth}</span>
                  <div className="flex gap-4">
                    <Button
                      variant="secondary"
                      className="px-8 py-2 text-xl"
                      onClick={handleCancel}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="primary"
                      className="px-8 py-2 text-xl"
                      onClick={handleOk}
                    >
                      OK
                    </Button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
