import { useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { playSound, vibrate, resumeAudioContext } from '@/utils/soundEffects';
import { useSettings } from '@/hooks/useSettings';

const getSoundType = (value) => {
  if (value === 0) return 'dot';
  if (value === 4) return 'boundary';
  if (value === 6) return 'six';
  if (value === 'W') return 'wicket';
  if (value === 'WD') return 'wide';
  if (value === 'NB') return 'noBall';
  return 'run';
};

const ScoringControls = ({ onScore, onWicket, disabled }) => {
  const { soundEnabled, vibrationEnabled } = useSettings();

  const triggerFeedback = useCallback((type) => {
    resumeAudioContext();
    if (soundEnabled) playSound(type);
    if (vibrationEnabled) vibrate(type);
  }, [soundEnabled, vibrationEnabled]);

  const handleScore = useCallback((value) => {
    triggerFeedback(getSoundType(value));
    onScore(value);
  }, [triggerFeedback, onScore]);

  const handleWicket = useCallback(() => {
    triggerFeedback('wicket');
    onWicket();
  }, [triggerFeedback, onWicket]);

  // Keyboard shortcuts
  useEffect(() => {
    if (disabled) return;

    const handler = (e) => {
      // Ignore if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;

      const key = e.key.toLowerCase();
      if (key >= '0' && key <= '6') {
        e.preventDefault();
        handleScore(parseInt(key));
      } else if (key === 'w') {
        e.preventDefault();
        handleWicket();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [disabled, handleScore, handleWicket]);

  const runButtons = [
    { value: 0, label: '0', variant: 'secondary', shortcut: '0' },
    { value: 1, label: '1', variant: 'outline', shortcut: '1' },
    { value: 2, label: '2', variant: 'outline', shortcut: '2' },
    { value: 3, label: '3', variant: 'outline', shortcut: '3' },
    { value: 4, label: '4', variant: 'default', highlight: true, shortcut: '4' },
    { value: 5, label: '5', variant: 'outline', shortcut: '5' },
    { value: 6, label: '6', variant: 'default', highlight: true, shortcut: '6' },
  ];

  const extraButtons = [
    { value: 'W', label: 'W', variant: 'destructive', onClick: handleWicket, shortcut: 'W' },
    { value: 'WD', label: 'WD', variant: 'outline' },
    { value: 'NB', label: 'NB', variant: 'outline' },
    { value: 'LB', label: 'LB', variant: 'outline' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border pt-3 pb-4 safe-area-pb z-30">
      <div className="max-w-md mx-auto px-4">
        {/* Run Buttons */}
        <div className="grid grid-cols-7 gap-1.5 mb-3">
          {runButtons.map(({ value, label, variant, highlight, shortcut }) => (
            <Button
              key={value}
              variant={variant}
              className={cn(
                "h-14 text-xl font-bold rounded-xl transition-all active:scale-95 relative",
                highlight && "shadow-button ring-1 ring-primary/30",
                value === 4 && "bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400",
                value === 6 && "bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
              )}
              onClick={() => handleScore(value)}
              disabled={disabled}
              title={`Press ${shortcut}`}
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Extra Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {extraButtons.map(({ value, label, variant, onClick, shortcut }) => (
            <Button
              key={value}
              variant={variant}
              className={cn(
                "h-12 text-sm font-bold rounded-xl transition-all active:scale-95",
                value === 'W' && "shadow-md"
              )}
              onClick={onClick || (() => handleScore(value))}
              disabled={disabled}
              title={shortcut ? `Press ${shortcut}` : undefined}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoringControls;
