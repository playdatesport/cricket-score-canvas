import { useState } from 'react';
import { Settings, Volume2, VolumeX, Vibrate, Check, X, Type } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

const SettingsPanel = () => {
  const [open, setOpen] = useState(false);
  const { soundEnabled, vibrationEnabled, toggleSound, toggleVibration } = useSettings();
  const { mode, toggleTheme, isDark, colorTheme, setColorTheme, fontId, setFontId, themes, fonts } = useTheme();

  if (!open) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="rounded-full"
        title="Settings"
      >
        <Settings className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
      <div
        className="bg-card w-full max-w-md rounded-t-2xl sm:rounded-2xl p-5 max-h-[85vh] overflow-y-auto animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold">Settings</h2>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Sound & Vibration */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Feedback</h3>
          <button
            onClick={toggleSound}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
              <span className="font-medium">Sound Effects</span>
            </div>
            <div className={cn(
              "w-11 h-6 rounded-full transition-colors flex items-center px-0.5",
              soundEnabled ? "bg-primary" : "bg-muted-foreground/30"
            )}>
              <div className={cn(
                "w-5 h-5 rounded-full bg-white shadow transition-transform",
                soundEnabled ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
          </button>
          <button
            onClick={toggleVibration}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3">
              <Vibrate className={cn("w-5 h-5", vibrationEnabled ? "text-primary" : "text-muted-foreground")} />
              <span className="font-medium">Vibration</span>
            </div>
            <div className={cn(
              "w-11 h-6 rounded-full transition-colors flex items-center px-0.5",
              vibrationEnabled ? "bg-primary" : "bg-muted-foreground/30"
            )}>
              <div className={cn(
                "w-5 h-5 rounded-full bg-white shadow transition-transform",
                vibrationEnabled ? "translate-x-5" : "translate-x-0"
              )} />
            </div>
          </button>
        </div>

        {/* Dark/Light Mode */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Appearance</h3>
          <div className="flex gap-2">
            <button
              onClick={() => !isDark || toggleTheme()}
              className={cn(
                "flex-1 p-3 rounded-xl text-sm font-medium transition-all border-2",
                !isDark ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted/50 text-muted-foreground"
              )}
            >
              ☀️ Light
            </button>
            <button
              onClick={() => isDark || toggleTheme()}
              className={cn(
                "flex-1 p-3 rounded-xl text-sm font-medium transition-all border-2",
                isDark ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-muted/50 text-muted-foreground"
              )}
            >
              🌙 Dark
            </button>
          </div>
        </div>

        {/* Color Themes */}
        <div className="space-y-3 mb-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Color Theme</h3>
          <div className="grid grid-cols-3 gap-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                className={cn(
                  "p-3 rounded-xl text-xs font-medium transition-all border-2 flex items-center gap-2",
                  colorTheme === t.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-muted/50 hover:bg-muted"
                )}
              >
                <span
                  className="w-4 h-4 rounded-full shrink-0"
                  style={{ background: `hsl(${t.primary})` }}
                />
                <span className="truncate">{t.label}</span>
                {colorTheme === t.id && <Check className="w-3 h-3 text-primary shrink-0 ml-auto" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Type className="w-4 h-4" /> Font
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map(f => (
              <button
                key={f.id}
                onClick={() => setFontId(f.id)}
                className={cn(
                  "p-3 rounded-xl text-sm transition-all border-2",
                  fontId === f.id
                    ? "border-primary bg-primary/10 font-semibold"
                    : "border-transparent bg-muted/50 hover:bg-muted"
                )}
                style={{ fontFamily: f.family }}
              >
                {f.label}
                {fontId === f.id && <Check className="w-3 h-3 text-primary inline ml-2" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
