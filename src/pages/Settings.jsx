import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, Volume2, VolumeX, Vibrate, Check, Type, Palette, 
  Sun, Moon, Pipette
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTheme } from '@/hooks/useTheme';
import { useSettings } from '@/hooks/useSettings';
import { cn } from '@/lib/utils';

const Toggle = ({ enabled, onToggle, icon: Icon, label }) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between p-4 rounded-2xl bg-card border border-border/50 hover:border-border transition-colors"
  >
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center",
        enabled ? "bg-primary/10" : "bg-muted"
      )}>
        <Icon className={cn("w-5 h-5", enabled ? "text-primary" : "text-muted-foreground")} />
      </div>
      <span className="font-medium">{label}</span>
    </div>
    <div className={cn(
      "w-12 h-7 rounded-full transition-colors flex items-center px-0.5",
      enabled ? "bg-primary" : "bg-muted-foreground/30"
    )}>
      <div className={cn(
        "w-6 h-6 rounded-full bg-white shadow-md transition-transform",
        enabled ? "translate-x-5" : "translate-x-0"
      )} />
    </div>
  </button>
);

const Settings = () => {
  const { soundEnabled, vibrationEnabled, toggleSound, toggleVibration } = useSettings();
  const { 
    mode, toggleTheme, isDark, colorTheme, setColorTheme, 
    fontId, setFontId, themes, fonts, customColor, setCustomColor 
  } = useTheme();

  const [pickerColor, setPickerColor] = useState(customColor || '#3b82f6');

  const handleCustomColor = () => {
    setCustomColor(pickerColor);
    setColorTheme('custom');
  };

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <div className="sticky top-0 bg-background/95 backdrop-blur-lg border-b border-border z-10">
        <div className="flex items-center gap-3 p-4 max-w-md mx-auto">
          <Link to="/" className="p-2 -m-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold text-lg">Settings</h1>
        </div>
      </div>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* Feedback Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Feedback
          </h2>
          <Toggle enabled={soundEnabled} onToggle={toggleSound} icon={soundEnabled ? Volume2 : VolumeX} label="Sound Effects" />
          <Toggle enabled={vibrationEnabled} onToggle={toggleVibration} icon={Vibrate} label="Vibration" />
        </section>

        {/* Appearance Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Appearance
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => isDark && toggleTheme()}
              className={cn(
                "flex-1 p-4 rounded-2xl font-medium transition-all border-2 flex items-center justify-center gap-2",
                !isDark ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-card text-muted-foreground"
              )}
            >
              <Sun className="w-5 h-5" /> Light
            </button>
            <button
              onClick={() => !isDark && toggleTheme()}
              className={cn(
                "flex-1 p-4 rounded-2xl font-medium transition-all border-2 flex items-center justify-center gap-2",
                isDark ? "border-primary bg-primary/10 text-primary" : "border-transparent bg-card text-muted-foreground"
              )}
            >
              <Moon className="w-5 h-5" /> Dark
            </button>
          </div>
        </section>

        {/* Color Themes Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
            <Palette className="w-4 h-4" /> Color Theme
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => setColorTheme(t.id)}
                className={cn(
                  "p-3 rounded-2xl text-xs font-medium transition-all border-2 flex items-center gap-2",
                  colorTheme === t.id
                    ? "border-primary bg-primary/10"
                    : "border-transparent bg-card hover:bg-muted/50"
                )}
              >
                <span
                  className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                  style={{ background: `hsl(${t.primary})` }}
                />
                <span className="truncate">{t.label}</span>
                {colorTheme === t.id && <Check className="w-3 h-3 text-primary shrink-0 ml-auto" />}
              </button>
            ))}
          </div>

          {/* Custom Color Picker */}
          <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
            <div className="flex items-center gap-2">
              <Pipette className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Custom Color</Label>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="color"
                  value={pickerColor}
                  onChange={(e) => setPickerColor(e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer border-2 border-border bg-transparent"
                  style={{ padding: 0 }}
                />
              </div>
              <Input
                value={pickerColor}
                onChange={(e) => setPickerColor(e.target.value)}
                placeholder="#3b82f6"
                className="flex-1 h-12 rounded-xl font-mono text-sm"
                maxLength={7}
              />
              <Button
                onClick={handleCustomColor}
                className="h-12 rounded-xl px-5"
                size="sm"
              >
                Apply
              </Button>
            </div>
            {colorTheme === 'custom' && (
              <p className="text-xs text-primary flex items-center gap-1">
                <Check className="w-3 h-3" /> Custom color active
              </p>
            )}
          </div>
        </section>

        {/* Font Section */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1 flex items-center gap-2">
            <Type className="w-4 h-4" /> Font
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {fonts.map(f => (
              <button
                key={f.id}
                onClick={() => setFontId(f.id)}
                className={cn(
                  "p-4 rounded-2xl text-sm transition-all border-2 text-left",
                  fontId === f.id
                    ? "border-primary bg-primary/10 font-semibold"
                    : "border-transparent bg-card hover:bg-muted/50"
                )}
                style={{ fontFamily: f.family }}
              >
                <span className="text-base">{f.label}</span>
                <span className="block text-xs text-muted-foreground mt-1" style={{ fontFamily: f.family }}>
                  Aa Bb Cc 123
                </span>
                {fontId === f.id && <Check className="w-3 h-3 text-primary inline ml-1" />}
              </button>
            ))}
          </div>
        </section>

        {/* Keyboard Shortcuts Info */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-1">
            Keyboard Shortcuts
          </h2>
          <div className="p-4 rounded-2xl bg-card border border-border/50">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['0', 'Dot ball'], ['1-6', 'Runs'], ['W', 'Wicket'],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center gap-2">
                  <kbd className="px-2 py-1 rounded-lg bg-muted text-xs font-mono font-bold">{key}</kbd>
                  <span className="text-muted-foreground">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
