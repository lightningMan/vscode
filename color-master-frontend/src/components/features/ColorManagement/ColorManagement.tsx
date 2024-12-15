import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Plus, Tags, Download, Upload } from 'lucide-react';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { zhCN } from '../../../lib/i18n';
import { addColorCollection } from '../../../store/slices/colorSlice';
import type { RootState } from '../../../store/store';

interface TouchPosition {
  x: number;
  y: number;
}

const ColorManagement: React.FC = () => {
  const dispatch = useDispatch();
  const collections = useSelector((state: RootState) => state.color.colorCollections);
  const selectedColor = useSelector((state: RootState) => state.color.selectedColor);
  const [touchStart, setTouchStart] = React.useState<TouchPosition | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<TouchPosition | null>(null);

  const getContrastColor = (bgColor: string) => {
    const r = parseInt(bgColor.slice(1, 3), 16);
    const g = parseInt(bgColor.slice(3, 5), 16);
    const b = parseInt(bgColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  };

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
      console.log(distanceX > 0 ? 'Swiped left' : 'Swiped right');
    }

    setTouchStart(null);
    setTouchEnd(null);
  }, [touchStart, touchEnd]);

  return (
    <TooltipProvider>
      <Card
        className="p-6 w-full max-w-2xl mx-auto mt-8 transition-colors duration-300"
        style={selectedColor ? {
          backgroundColor: `${selectedColor}10`,
          borderColor: selectedColor,
        } : undefined}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{zhCN.colorManagement.title}</h2>
          </div>

          {collections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tags className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>{zhCN.colorManagement.collections}</p>
            </div>
          ) : (
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {collections.map((collection) => (
                <Card
                  key={collection.id}
                  className="p-4 transition-transform hover:scale-105 duration-200 shadow-sm hover:shadow-md"
                >
                  <h3 className="font-semibold mb-2">{collection.name}</h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {collection.colors.map((color, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger asChild>
                          <div
                            className="w-6 h-6 rounded-md border cursor-pointer transition-transform hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{color}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {collection.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs bg-muted px-2 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      <div className="fixed bottom-6 right-6 flex flex-col gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110"
              onClick={async () => {
                if (!selectedColor) return;
                try {
                  const response = await fetch(`${import.meta.env.VITE_API_URL}/colors/collections`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                    body: JSON.stringify({ colors: [selectedColor], name: '新建配色', tags: [] }),
                  });
                  if (response.ok) {
                    const data = await response.json();
                    dispatch(addColorCollection(data));
                    alert('颜色配置创建成功！');
                  } else {
                    const errorData = await response.json();
                    alert('创建失败: ' + (errorData.detail || '请稍后重试'));
                  }
                } catch (error) {
                  console.error('Failed to create color collection:', error);
                  alert('创建失败：网络错误，请稍后重试');
                }
              }}
              style={selectedColor ? {
                backgroundColor: selectedColor,
                color: getContrastColor(selectedColor),
              } : undefined}
            >
              <Plus className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{zhCN.colorManagement.createTooltip}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110"
            >
              <Upload className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{zhCN.colorManagement.importTooltip}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-12 h-12 shadow-lg transition-transform hover:scale-110"
            >
              <Download className="w-6 h-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{zhCN.colorManagement.exportTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default ColorManagement;
