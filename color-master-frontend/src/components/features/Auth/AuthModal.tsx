import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../../components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

interface AuthModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onOpenChange }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (type: 'login' | 'register') => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        onOpenChange(false);
      } else {
        const errorData = await response.json();
        setError(errorData.detail || '认证失败');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] p-6 gap-6 transition-all duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight">用户认证</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login" className="text-base transition-colors duration-200">登录</TabsTrigger>
            <TabsTrigger value="register" className="text-base transition-colors duration-200">注册</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="space-y-6 mt-2">
            <div className="space-y-4">
              <Input
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              {error && (
                <div className="text-red-500 text-sm font-medium">{error}</div>
              )}
              <Button
                className="w-full transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-offset-2"
                onClick={() => handleSubmit('login')}
                disabled={isLoading}
              >
                {isLoading ? '登录中...' : '登录'}
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="register" className="space-y-6 mt-2">
            <div className="space-y-4">
              <Input
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
              />
              <Input
                type="password"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
              {error && (
                <div className="text-red-500 text-sm font-medium">{error}</div>
              )}
              <Button
                className="w-full transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-offset-2"
                onClick={() => handleSubmit('register')}
                disabled={isLoading}
              >
                {isLoading ? '注册中...' : '注册'}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
