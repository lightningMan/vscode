import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Palette } from 'lucide-react';
import { Card } from '../../ui/card';
import { Progress } from '../../ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { zhCN } from '../../../lib/i18n';
import type { RootState } from '../../../store/store';

interface ColorMixture {
  color: string;
  percentage: number;
}

export const ColorDecomposition: React.FC = () => {
  const selectedColor = useSelector((state: RootState) => state.color.selectedColor);
  const [mixtures, setMixtures] = useState<ColorMixture[]>([]);
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const decomposeColor = (color: string) => {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);

    const components: ColorMixture[] = [
      { color: '#FF0000', percentage: (r / 255) * 100 },
      { color: '#00FF00', percentage: (g / 255) * 100 },
      { color: '#0000FF', percentage: (b / 255) * 100 },
    ].filter(c => c.percentage > 5);

    const total = components.reduce((sum, c) => sum + c.percentage, 0);
    return components.map(c => ({
      ...c,
      percentage: Math.round((c.percentage / total) * 100),
    }));
  };

  useEffect(() => {
    if (selectedColor) {
      setMixtures(decomposeColor(selectedColor));
    }
  }, [selectedColor]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > 50) {
      console.log(distanceX > 0 ? 'Next recommendation' : 'Previous recommendation');
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd]);

  if (!selectedColor) {
    return (
      <TooltipProvider>
        <Card className="p-6 w-full max-w-2xl mx-auto mt-8">
          <div className="text-center py-8 text-muted-foreground">
            <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{zhCN.colorDecomposition.noColorSelected}</p>
          </div>
        </Card>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Card
        className="p-6 w-full max-w-2xl mx-auto mt-8 transition-colors duration-300"
        style={{
          backgroundColor: `${selectedColor}10`,
          borderColor: selectedColor,
        }}
      >
        <div
          className="space-y-6"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{zhCN.colorDecomposition.title}</h2>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="w-12 h-12 rounded-md border transition-transform hover:scale-110 cursor-pointer"
                  style={{ backgroundColor: selectedColor }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>{selectedColor}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">{zhCN.colorDecomposition.mixture}</h3>
            {mixtures.map((mixture, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-6 h-6 rounded-md border transition-transform hover:scale-110"
                          style={{ backgroundColor: mixture.color }}
                        />
                        <span>{mixture.color}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{zhCN.colorDecomposition.mixingTooltip}</p>
                    </TooltipContent>
                  </Tooltip>
                  <span>{mixture.percentage}%</span>
                </div>
                <Progress
                  value={mixture.percentage}
                  className="transition-all duration-300"
                  style={{
                    '--progress-background': mixture.color,
                  } as React.CSSProperties}
                />
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <h3 className="font-semibold mb-4">{zhCN.colorDecomposition.recommendations}</h3>
            <div className="grid grid-cols-2 gap-4">
              {mixtures.map((mixture, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Card className="p-4 transition-transform hover:scale-105 duration-200">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-8 h-8 rounded-md border"
                          style={{ backgroundColor: mixture.color }}
                        />
                        <div>
                          <p className="font-medium">{mixture.percentage}%</p>
                          <p className="text-sm text-muted-foreground">{mixture.color}</p>
                        </div>
                      </div>
                    </Card>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{zhCN.colorDecomposition.mixingTooltip}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </TooltipProvider>
  );
};
