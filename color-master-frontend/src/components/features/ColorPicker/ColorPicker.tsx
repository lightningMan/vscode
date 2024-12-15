import React, { useRef, useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../ui/tooltip';
import { Card } from '../../ui/card';
import { zhCN } from '../../../lib/i18n';
import { addRecentColor, setSelectedColor } from '../../../store/slices/colorSlice';
import type { RootState } from '../../../store/store';

export const ColorPicker: React.FC = () => {
  const dispatch = useDispatch();
  const recentColors = useSelector((state: RootState) => state.color.recentColors);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [localSelectedColor, setLocalSelectedColor] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);

        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (canvas) {
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  });

  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ctx = canvas.getContext('2d');
      const pixel = ctx?.getImageData(x, y, 1, 1).data;

      if (pixel) {
        const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
        setLocalSelectedColor(color);
        dispatch(setSelectedColor(color));
        dispatch(addRecentColor(color));
      }
    }
  }, [dispatch]);

  const handleCanvasMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      setMagnifierPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      setMagnifierPosition({ x, y });

      const ctx = canvas.getContext('2d');
      const pixel = ctx?.getImageData(x, y, 1, 1).data;

      if (pixel) {
        const color = `#${pixel[0].toString(16).padStart(2, '0')}${pixel[1].toString(16).padStart(2, '0')}${pixel[2].toString(16).padStart(2, '0')}`;
        setLocalSelectedColor(color);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (localSelectedColor) {
      dispatch(setSelectedColor(localSelectedColor));
      dispatch(addRecentColor(localSelectedColor));
    }
  }, [dispatch, localSelectedColor]);

  return (
    <TooltipProvider>
      <Card className="p-6 w-full max-w-2xl mx-auto">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{zhCN.colorPicker.title}</h2>

          <Tooltip>
            <TooltipTrigger asChild>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                  ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2">{zhCN.colorPicker.dragDropHint}</p>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{zhCN.colorPicker.dragDropTooltip}</p>
            </TooltipContent>
          </Tooltip>

          {imageUrl && (
            <div className="relative touch-none">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full h-auto cursor-crosshair"
              />
              <div
                className="absolute w-16 h-16 border-2 border-white rounded-full pointer-events-none magnifier md:block hidden"
                style={{
                  left: magnifierPosition.x - 32,
                  top: magnifierPosition.y - 32,
                  transform: 'scale(2)',
                  backgroundImage: `url(${imageUrl})`,
                  backgroundPosition: `${-magnifierPosition.x * 2 + 32}px ${-magnifierPosition.y * 2 + 32}px`,
                }}
              />
            </div>
          )}

          {localSelectedColor && (
            <div className="flex items-center space-x-4">
              <div
                className="w-12 h-12 rounded-md border"
                style={{ backgroundColor: localSelectedColor }}
              />
              <div className="space-y-1">
                <p>{zhCN.colorPicker.hex}: {localSelectedColor}</p>
                <p>{zhCN.colorPicker.rgb}: {localSelectedColor && `rgb(${parseInt(localSelectedColor.slice(1, 3), 16)}, ${parseInt(localSelectedColor.slice(3, 5), 16)}, ${parseInt(localSelectedColor.slice(5, 7), 16)})`}</p>
                <p>{zhCN.colorPicker.hsl}: {localSelectedColor && (() => {
                  const r = parseInt(localSelectedColor.slice(1, 3), 16) / 255;
                  const g = parseInt(localSelectedColor.slice(3, 5), 16) / 255;
                  const b = parseInt(localSelectedColor.slice(5, 7), 16) / 255;
                  const max = Math.max(r, g, b), min = Math.min(r, g, b);
                  const l = (max + min) / 2;
                  const d = max - min;
                  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                  let h = 0;
                  if (max !== min) {
                    switch (max) {
                      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                      case g: h = (b - r) / d + 2; break;
                      case b: h = (r - g) / d + 4; break;
                    }
                    h /= 6;
                  }
                  return `hsl(${Math.round(h * 360)}°, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
                })()}</p>
              </div>
            </div>
          )}

          {recentColors.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">{zhCN.colorPicker.recentColors}</h3>
              <div className="flex flex-wrap gap-2">
                {recentColors.map((color, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div
                        className="w-8 h-8 rounded-md border cursor-pointer hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setLocalSelectedColor(color);
                          dispatch(setSelectedColor(color));
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{color}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </TooltipProvider>
  );
};
