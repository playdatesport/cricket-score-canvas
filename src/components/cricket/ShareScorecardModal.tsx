import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { MatchState } from '@/types/cricket';
import { Share2, Download, Copy, Check, Image } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ShareScorecardModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchState: MatchState;
}

const ShareScorecardModal: React.FC<ShareScorecardModalProps> = ({
  isOpen,
  onClose,
  matchState,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const { battingTeam, bowlingTeam, matchDetails, allBatters, fallOfWickets } = matchState;

  const generateImage = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
      });
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error generating image:', error);
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const dataUrl = await generateImage();
    if (dataUrl) {
      const link = document.createElement('a');
      link.download = `${battingTeam.name}-vs-${bowlingTeam.name}-scorecard.png`;
      link.href = dataUrl;
      link.click();
      toast({
        title: "Downloaded!",
        description: "Scorecard image saved successfully",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      const dataUrl = await generateImage();
      if (dataUrl) {
        try {
          const blob = await (await fetch(dataUrl)).blob();
          const file = new File([blob], 'scorecard.png', { type: 'image/png' });
          await navigator.share({
            title: `${battingTeam.name} vs ${bowlingTeam.name}`,
            text: `${battingTeam.name}: ${battingTeam.score}/${battingTeam.wickets} (${battingTeam.overs}.${battingTeam.balls} ov)`,
            files: [file],
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      }
    } else {
      handleCopyText();
    }
  };

  const handleCopyText = () => {
    const text = `🏏 ${matchDetails.matchType} Match

${battingTeam.name}: ${battingTeam.score}/${battingTeam.wickets} (${battingTeam.overs}.${battingTeam.balls} ov)
${bowlingTeam.name}: ${bowlingTeam.score}/${bowlingTeam.wickets}

📍 ${matchDetails.venue}
📅 ${matchDetails.date}

Top Scorers:
${allBatters.slice(0, 3).map(b => `• ${b.name}: ${b.runs}(${b.balls})`).join('\n')}

#Cricket #LiveScore`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Scorecard text copied to clipboard",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-5 h-5 text-primary" />
            Share Scorecard
          </DialogTitle>
        </DialogHeader>

        {/* Scorecard Preview */}
        <div 
          ref={cardRef}
          className="bg-gradient-to-br from-primary/5 via-background to-primary/10 rounded-xl p-4 border border-border"
        >
          {/* Header */}
          <div className="text-center mb-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {matchDetails.matchType} • {matchDetails.venue}
            </p>
            <p className="text-xs text-muted-foreground">{matchDetails.date}</p>
          </div>

          {/* Score */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h3 className="font-bold text-lg text-foreground">{battingTeam.name}</h3>
              <p className="text-3xl font-extrabold text-primary">
                {battingTeam.score}/{battingTeam.wickets}
              </p>
              <p className="text-sm text-muted-foreground">
                ({battingTeam.overs}.{battingTeam.balls} ov)
              </p>
            </div>
            <div className="px-4 text-2xl font-bold text-muted-foreground">vs</div>
            <div className="text-center flex-1">
              <h3 className="font-bold text-lg text-foreground">{bowlingTeam.name}</h3>
              <p className="text-3xl font-extrabold text-muted-foreground">
                {bowlingTeam.score}/{bowlingTeam.wickets}
              </p>
              {bowlingTeam.target && (
                <p className="text-sm text-muted-foreground">Target: {bowlingTeam.target}</p>
              )}
            </div>
          </div>

          {/* Top Scorers */}
          <div className="bg-card/50 rounded-lg p-3 mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-2">TOP SCORERS</p>
            <div className="space-y-1">
              {[...allBatters].sort((a, b) => b.runs - a.runs).slice(0, 3).map((batter, idx) => (
                <div key={batter.id} className="flex justify-between text-sm">
                  <span className="text-foreground">{batter.name}</span>
                  <span className="font-semibold text-primary">
                    {batter.runs} ({batter.balls})
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Fall of Wickets */}
          {fallOfWickets.length > 0 && (
            <div className="text-xs text-muted-foreground text-center">
              FOW: {fallOfWickets.map(f => `${f.score}-${f.wicketNumber}`).join(', ')}
            </div>
          )}

          {/* Branding */}
          <div className="text-center mt-4 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground">🏏 Cricket Scorer</p>
          </div>
        </div>

        {/* Share Actions */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <Button
            variant="outline"
            onClick={handleCopyText}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            {copied ? <Check className="w-5 h-5 text-success" /> : <Copy className="w-5 h-5" />}
            <span className="text-xs">{copied ? 'Copied!' : 'Copy Text'}</span>
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex flex-col items-center gap-1 h-auto py-3"
          >
            <Image className="w-5 h-5" />
            <span className="text-xs">{isGenerating ? 'Saving...' : 'Save Image'}</span>
          </Button>
          <Button
            onClick={handleShare}
            disabled={isGenerating}
            className="flex flex-col items-center gap-1 h-auto py-3 gradient-primary"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareScorecardModal;
