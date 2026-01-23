import { useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Trophy, History, BarChart3, Plus, ChevronRight,
  Target, TrendingUp, Zap, Users
} from 'lucide-react';
import ThemeToggle from '@/components/ThemeToggle';

const FeatureCard = memo(({ icon: Icon, title, description, color, delay }) => (
  <div 
    className="p-4 rounded-2xl bg-card border border-border/50 hover-lift animate-in fade-in slide-in-from-bottom-4"
    style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
  >
    <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3 shadow-soft`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="font-semibold text-sm mb-1">{title}</h3>
    <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
  </div>
));

FeatureCard.displayName = 'FeatureCard';

const FEATURES = [
  { icon: Trophy, title: 'Live Scoring', description: 'Real-time ball-by-ball updates with instant stats', color: 'gradient-primary' },
  { icon: BarChart3, title: 'Smart Analytics', description: 'Detailed match statistics and trends', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
  { icon: Target, title: 'Wagon Wheel', description: 'Visual shot placement tracking', color: 'bg-gradient-to-br from-orange-500 to-amber-500' },
  { icon: TrendingUp, title: 'Run Rate', description: 'Track and predict scoring patterns', color: 'bg-gradient-to-br from-purple-500 to-violet-600' },
];

const QuickAction = memo(({ icon: Icon, label, onClick, variant = 'outline' }) => (
  <Button 
    variant={variant} 
    onClick={onClick}
    className="h-14 flex items-center justify-between px-4 group"
  >
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="font-medium">{label}</span>
    </div>
    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
  </Button>
));

QuickAction.displayName = 'QuickAction';

const WelcomeScreen = ({ onNewMatch, onShowHistory, onNavigateStats, matchCount = 0 }) => {
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('cricket-onboarding-seen');
  });

  const handleDismissOnboarding = () => {
    localStorage.setItem('cricket-onboarding-seen', 'true');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle className="bg-card/80 backdrop-blur-sm border border-border shadow-soft" />
      </div>

      {/* Hero Section */}
      <div className="gradient-hero pt-12 pb-8 px-4">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative animate-float">
            <div className="absolute inset-0 rounded-3xl gradient-primary opacity-20 blur-xl" />
            <div className="relative w-full h-full rounded-3xl gradient-primary flex items-center justify-center shadow-glow">
              <Trophy className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gradient-blue">Cricket Scorer</h1>
          <p className="text-muted-foreground">Professional cricket scoring made simple</p>
        </div>
      </div>

      <div className="flex-1 px-4 pb-8 -mt-4">
        <div className="max-w-md mx-auto space-y-6">
          {/* Primary CTA */}
          <Card className="p-0 overflow-hidden border-0 shadow-card animate-in fade-in slide-in-from-bottom-4">
            <Button 
              onClick={onNewMatch} 
              className="w-full h-16 text-lg font-semibold rounded-xl gradient-primary shadow-button hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Plus className="w-6 h-6 mr-3" />
              Start New Match
            </Button>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '100ms' }}>
            <QuickAction 
              icon={History} 
              label={matchCount > 0 ? `Match History (${matchCount})` : 'Match History'} 
              onClick={onShowHistory} 
            />
            <QuickAction 
              icon={BarChart3} 
              label="Statistics" 
              onClick={onNavigateStats} 
            />
          </div>

          {/* Onboarding Tips */}
          {showOnboarding && (
            <Card className="p-4 bg-primary/5 border-primary/20 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: '200ms' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">Quick Start Guide</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Set up teams, start scoring, and track every ball. Your match data is automatically saved!
                  </p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleDismissOnboarding}
                    className="text-xs h-7 px-2"
                  >
                    Got it
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((feature, index) => (
              <FeatureCard key={feature.title} {...feature} delay={300 + index * 100} />
            ))}
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-muted-foreground pt-4 animate-in fade-in" style={{ animationDelay: '700ms' }}>
            Track every ball • Analyze every innings
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
