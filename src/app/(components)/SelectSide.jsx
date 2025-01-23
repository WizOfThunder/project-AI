"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Button from "./Button";

const COLORS = {
  left: {
    primary: "#ff4d4d",
    text: "#ffffff",
  },
  right: {
    primary: "#2b2b7b",
    text: "#ffffff",
  },
};

const PLAYERS = {
  left: {
    name: "Macan",
    image: "/assets/tiger_circle.png",
  },
  right: {
    name: "Uwong",
    image: "/assets/uwong_circle.png",
  },
};

export default function SelectSide() {
  const [selected, setSelected] = useState(null);

  const handleSelect = (side) => {
    // Reset if clicking the same side
    if (selected === side) {
      setSelected(null);
      return;
    }
    setSelected(side);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="flex h-full">
        {/* Left Side */}
        <motion.div
          className="relative flex-1 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: COLORS.left.primary,
            clipPath: "polygon(0 0, 100% 0, calc(100% - 40px) 100%, 0 100%)",
          }}
          animate={{
            flex: selected === "right" ? 0.3 : selected === "left" ? 1.3 : 1,
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          onClick={() => handleSelect("left")}
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
              opacity: selected === "right" ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex flex-col items-center justify-center h-full gap-8 p-8">
            <motion.div
              className="w-48 h-48"
              animate={{
                scale: selected === "left" ? 1.1 : 1,
                y: selected === "left" ? -20 : 0,
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <img
                src={PLAYERS.left.image || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{
                scale: selected === "left" ? 1.1 : 1,
              }}
            >
              <h2
                className="text-5xl font-bold tracking-wider"
                style={{ color: COLORS.left.text }}
              >
                {PLAYERS.left.name}
              </h2>
              {selected === "left" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button variant="secondary" className="px-8 py-2 text-xl">
                    Select
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side */}
        <motion.div
          className="relative flex-1 cursor-pointer overflow-hidden"
          style={{
            backgroundColor: COLORS.right.primary,
            clipPath: "polygon(40px 0, 100% 0, 100% 100%, 0 100%)",
          }}
          animate={{
            flex: selected === "left" ? 0.3 : selected === "right" ? 1.3 : 1,
          }}
          transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
          onClick={() => handleSelect("right")}
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
              opacity: selected === "left" ? 0.5 : 0,
            }}
            transition={{ duration: 0.3 }}
          />

          <div className="relative flex flex-col items-center justify-center h-full gap-8 p-8">
            <motion.div
              className="w-48 h-48"
              animate={{
                scale: selected === "right" ? 1.1 : 1,
                y: selected === "right" ? -20 : 0,
              }}
              transition={{ duration: 0.5, type: "spring" }}
            >
              <img
                src={PLAYERS.right.image || "/placeholder.svg"}
                alt=""
                className="w-full h-full object-contain"
              />
            </motion.div>
            <motion.div
              className="flex flex-col items-center gap-4"
              animate={{
                scale: selected === "right" ? 1.1 : 1,
              }}
            >
              <h2
                className="text-5xl font-bold tracking-wider"
                style={{ color: COLORS.right.text }}
              >
                {PLAYERS.right.name}
              </h2>
              {selected === "right" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button variant="secondary" className="px-8 py-2 text-xl">
                    Select
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
