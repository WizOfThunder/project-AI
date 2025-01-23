// src/utils/sound.js
const sounds = {
  playerUwongWin: new Audio("/assets/sound/player_UwongWin.mp3"),
  playerMacanWin: new Audio("/assets/sound/playerMacanWin.mp3"),
  playerUwongLose: new Audio("/assets/sound/playerUwongLose.mp3"),
  playerMacanLose: new Audio("/assets/sound/playerMacanLose.mp3"),
  uwongEntrance: new Audio("/assets/sound/uwongEntrance.mp3"),
  uwong9Entrance: new Audio("/assets/sound/uwong9Entrance.mp3"),
  macanEntrance: new Audio("/assets/sound/macanEntrance.mp3"),
  macanJump: new Audio("/assets/sound/macan_jump.mp3"),
  step: new Audio("/assets/sound/step.mp3"),
  ambientJungle: new Audio("/assets/sound/ambientJungle.mp3"),
};

/**
 * Memainkan sound effect.
 * @param {string} soundName - Nama file suara (tanpa ekstensi).
 * @param {number} volume - Volume suara (0-1).
 */
export const playSound = (soundName, volume = 1, loop = false) => {
  if (sounds[soundName]) {
    sounds[soundName].volume = volume;
    sounds[soundName].loop = loop;
    sounds[soundName].play();
    return sounds[soundName]; // Kembalikan instance audio untuk kontrol lebih lanjut
  } else {
    console.warn(`Sound "${soundName}" not found!`);
    return null;
  }
};
