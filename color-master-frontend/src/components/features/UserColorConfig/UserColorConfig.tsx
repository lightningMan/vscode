import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

interface ColorConfig {
  id: string;
  name: string;
  colors: string[];
  tags: string[];
}

export const UserColorConfig: React.FC = () => {
  const [colorConfigs, setColorConfigs] = useState<ColorConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserColors();
    }
  }, [isAuthenticated]);

  const fetchUserColors = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/colors`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setColorConfigs(data);
      } else {
        setError('获取颜色配置失败');
      }
    } catch (error) {
      console.error('Error fetching user colors:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(colorConfigs);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = '颜色配置.json';

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const content = e.target?.result as string;
          const importedConfigs = JSON.parse(content);

          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/colors/import`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(importedConfigs),
          });

          if (response.ok) {
            fetchUserColors();
          } else {
            setError('导入失败');
          }
        } catch (error) {
          console.error('Import error:', error);
          setError('导入文件格式错误');
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Card className="w-full max-w-3xl mx-auto mt-8 transition-all duration-200 hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
        <CardTitle className="text-2xl font-semibold tracking-tight">我的颜色配置</CardTitle>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={colorConfigs.length === 0}
            className="transition-all duration-200 hover:shadow-sm focus:ring-2 focus:ring-offset-2"
          >
            导出配置
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
              id="import-file"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('import-file')?.click()}
              className="transition-all duration-200 hover:shadow-sm focus:ring-2 focus:ring-offset-2"
            >
              导入配置
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-md">
            {error}
          </div>
        )}
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : colorConfigs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            还没有保存的颜色配置
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {colorConfigs.map((config) => (
              <Card
                key={config.id}
                className="group p-6 transition-all duration-200 hover:shadow-md"
              >
                <div className="flex flex-col space-y-4">
                  <h3 className="text-lg font-medium tracking-tight">{config.name}</h3>
                  <div className="flex flex-wrap gap-3">
                    {config.colors.map((color, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full border border-gray-200 transition-transform duration-200 hover:scale-110 hover:shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {config.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 text-sm bg-gray-100 rounded-full transition-colors duration-200 hover:bg-gray-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
