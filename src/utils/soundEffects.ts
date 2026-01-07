// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

type SoundType = 'run' | 'boundary' | 'six' | 'wicket' | 'wide' | 'noBall' | 'dot';

const soundConfigs: Record<SoundType, { frequency: number; duration: number; type: OscillatorType; gain: number }> = {
  run: { frequency: 440, duration: 0.1, type: 'sine', gain: 0.3 },
  boundary: { frequency: 880, duration: 0.3, type: 'square', gain: 0.4 },
  six: { frequency: 1200, duration: 0.5, type: 'sawtooth', gain: 0.5 },
  wicket: { frequency: 200, duration: 0.6, type: 'triangle', gain: 0.5 },
  wide: { frequency: 350, duration: 0.15, type: 'sine', gain: 0.25 },
  noBall: { frequency: 300, duration: 0.2, type: 'sine', gain: 0.25 },
  dot: { frequency: 250, duration: 0.05, type: 'sine', gain: 0.15 },
};

const vibrationPatterns: Record<SoundType, number[]> = {
  run: [50],
  boundary: [100, 50, 100],
  six: [100, 50, 100, 50, 150],
  wicket: [200, 100, 200],
  wide: [30, 30, 30],
  noBall: [40, 40, 40],
  dot: [20],
};

export const playSound = (type: SoundType): void => {
  const config = soundConfigs[type];
  
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.value = config.frequency;
  oscillator.type = config.type;
  
  gainNode.gain.setValueAtTime(config.gain, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + config.duration);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + config.duration);

  // Special melody for six
  if (type === 'six') {
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 1400;
      osc2.type = 'sawtooth';
      gain2.gain.setValueAtTime(0.4, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.3);
    }, 200);
  }

  // Victory fanfare for boundary
  if (type === 'boundary') {
    setTimeout(() => {
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc2.frequency.value = 1100;
      osc2.type = 'square';
      gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
      osc2.start(audioContext.currentTime);
      osc2.stop(audioContext.currentTime + 0.2);
    }, 150);
  }
};

export const vibrate = (type: SoundType): void => {
  if ('vibrate' in navigator) {
    navigator.vibrate(vibrationPatterns[type]);
  }
};

export const playSoundWithVibration = (type: SoundType): void => {
  playSound(type);
  vibrate(type);
};

export const resumeAudioContext = (): void => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
};
