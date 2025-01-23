// src/utils/sound.js
const sounds = {
  playerUwongWin: new Audio("/assets/sound/playerUwongWin.mp3"),
  playerMacanWin: new Audio("/assets/sound/playerMacanWin.mp3"),
  playerUwongLose: new Audio("/assets/sound/playerUwongLose.mp3"),
  playerMacanLose: new Audio("/assets/sound/playerMacanLose.mp3"),
  uwongEntrance: new Audio("/assets/sound/uwongEntrance.mp3"),
  uwong9Entrance: new Audio("/assets/sound/uwong9Entrance.mp3"),
  macanEntrance: new Audio("/assets/sound/macanEntrance.mp3"),
  macanJump: new Audio("/assets/sound/macanJump.mp3"),
  step: new Audio("/assets/sound/step.mp3"),
};

/**
 * Memainkan sound effect.
 * @param {string} soundName - Nama file suara (tanpa ekstensi).
 * @param {number} volume - Volume suara (0-1).
 */
export const playSound = (soundName, volume = 1) => {
  if (sounds[soundName]) {
    sounds[soundName].volume = volume; // Atur volume (0-1)
    sounds[soundName].play(); // Mainkan suara
  } else {
    console.warn(`Sound "${soundName}" not found!`);
  }
};
