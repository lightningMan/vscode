import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { zhCN } from '../../../lib/i18n';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';

interface WelcomeTutorialProps {
  open: boolean;
  onClose: () => void;
}

export const WelcomeTutorial: React.FC<WelcomeTutorialProps> = ({
  open,
  onClose,
}) => {
  const collections = useSelector((state: RootState) => state.color.colorCollections);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{zhCN.tutorial.welcome}</DialogTitle>
          <DialogDescription>
            {zhCN.tutorial.quickStart}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <h3 className="font-medium">{zhCN.tutorial.basics}</h3>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              {zhCN.tutorial.steps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">{zhCN.tutorial.advanced}</h3>
            <ul className="list-disc pl-4 space-y-1 text-sm">
              <li>创建和管理颜色集合</li>
              <li>使用标签组织颜色</li>
              <li>导入导出颜色方案</li>
              <li>分析颜色组成成分</li>
            </ul>
          </div>
          <div className="mt-6">
            <h3 className="font-medium mb-3">示例颜色集合</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {collections.map((collection) => (
                <Card key={collection.id} className="p-4">
                  <h4 className="font-medium mb-2">{collection.name}</h4>
                  <div className="flex flex-wrap gap-2">
                    {collection.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 rounded-md border transition-transform hover:scale-110"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
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
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full sm:w-auto">
            {zhCN.common.confirm}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
