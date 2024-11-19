import { Howl } from "howler";

// SECTION: Reproducir Sonido de Éxito
// INFO: Sonido de Éxito N°1
export const playSuccessSound1 = () => {
  const successSound = new Howl({ src: ["/sounds/correct1.mp3"] });
  successSound.play();
};

// INFO: Sonido de Éxito N°2
export const playSuccessSound2 = () => {
  const successSound = new Howl({ src: ["/sounds/correct2.mp3"] });
  successSound.play();
};

// SECTION: Reproducir Sonido de Error
// INFO: Sonido de Error N°1
export const playErrorSound1 = () => {
  const errorSound = new Howl({ src: ["/sounds/error1.mp3"] });
  errorSound.play();
};

// INFO: Sonido de Error N°2
export const playErrorSound2 = () => {
  const errorSound = new Howl({ src: ["/sounds/error2.mp3"] });
  errorSound.play();
};

// SECTION: Reproducir Sonido Fin de Partida
// INFO: Sonido de Partida Ganada
export const playWinGame = () => {
  const winnerSound = new Howl({ src: ["/sounds/winner.wav"] });
  winnerSound.play();
};

// INFO: Sonido de Partida Perdida
export const playGameOver = () => {
  const loserSound = new Howl({ src: ["/sounds/game_over.wav"] });
  loserSound.play();
};

// SECTION: Reproducir Sonido de Tiempo Fuera
export const playTimeOut = () => {
  const timeOut = new Howl({ src: ["/sounds/time_out.mp3"] });
  timeOut.play();
};
