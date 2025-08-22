// Configuration des effets sonores pour l'interface cartoon
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

const audioContext =
  typeof window !== 'undefined'
    ? new (window.AudioContext || window.webkitAudioContext)()
    : null;

/**
 * Joue un son de clic cartoon (pop court et aigu)
 */
export function playClick() {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Son de clic cartoon : fréquence élevée avec decay rapide
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.type = 'square';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.warn('Impossible de jouer le son de clic:', error);
  }
}

/**
 * Joue un son de succès cartoon (mélodie ascendante joyeuse)
 */
export function playSuccess() {
  if (!audioContext) return;
  
  try {
    // Première note
    const osc1 = audioContext.createOscillator();
    const gain1 = audioContext.createGain();
    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    
    osc1.frequency.setValueAtTime(523, audioContext.currentTime); // Do
    gain1.gain.setValueAtTime(0.08, audioContext.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    osc1.type = 'sine';
    osc1.start(audioContext.currentTime);
    osc1.stop(audioContext.currentTime + 0.2);
    
    // Deuxième note
    const osc2 = audioContext.createOscillator();
    const gain2 = audioContext.createGain();
    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    
    osc2.frequency.setValueAtTime(659, audioContext.currentTime + 0.1); // Mi
    gain2.gain.setValueAtTime(0.08, audioContext.currentTime + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    osc2.type = 'sine';
    osc2.start(audioContext.currentTime + 0.1);
    osc2.stop(audioContext.currentTime + 0.3);
    
    // Troisième note
    const osc3 = audioContext.createOscillator();
    const gain3 = audioContext.createGain();
    osc3.connect(gain3);
    gain3.connect(audioContext.destination);
    
    osc3.frequency.setValueAtTime(784, audioContext.currentTime + 0.2); // Sol
    gain3.gain.setValueAtTime(0.1, audioContext.currentTime + 0.2);
    gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    osc3.type = 'sine';
    osc3.start(audioContext.currentTime + 0.2);
    osc3.stop(audioContext.currentTime + 0.5);
  } catch (error) {
    console.warn('Impossible de jouer le son de succès:', error);
  }
}

/**
 * Joue un son d'erreur cartoon (buzz descendant)
 */
export function playError() {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Son d'erreur : fréquence descendante avec buzz
    oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.3);
    
    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.type = 'sawtooth';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.warn('Impossible de jouer le son d\'erreur:', error);
  }
}

/**
 * Joue un son de notification cartoon (ding léger)
 */
export function playNotification() {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    oscillator.type = 'sine';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.15);
  } catch (error) {
    console.warn('Impossible de jouer le son de notification:', error);
  }
}

/**
 * Joue un son de "whoosh" pour les animations
 */
export function playWhoosh() {
  if (!audioContext) return;
  
  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Effet whoosh avec filtre passe-bas
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.4);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.4);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.4);
    
    oscillator.type = 'sawtooth';
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.4);
  } catch (error) {
    console.warn('Impossible de jouer le son whoosh:', error);
  }
}

/**
 * Active ou désactive les effets sonores globalement
 */
let soundEnabled = true;

export function setSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

/**
 * Wrapper pour jouer un son seulement si les effets sonores sont activés
 */
export function playSoundIfEnabled(soundFunction: () => void) {
  if (soundEnabled) {
    soundFunction();
  }
}
