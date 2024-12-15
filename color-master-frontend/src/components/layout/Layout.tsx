import React, { useState } from 'react';
import { Toaster } from '../ui/toaster';
import { zhCN } from '../../lib/i18n';
import { Button } from '../ui/button';
import { AuthModal } from '../features/Auth/AuthModal';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <h1 className="text-xl font-bold">{zhCN.tutorial.welcome}</h1>
          <Button
            variant="ghost"
            className="transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:ring-2 focus:ring-offset-2"
            onClick={() => setIsAuthOpen(true)}
          >
            登录/注册
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        {children}
      </main>
      <AuthModal isOpen={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <Toaster />
    </div>
  );
};
