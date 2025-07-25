import { Shield } from 'lucide-react';

export const Header = () => {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-security bg-clip-text text-transparent">
                Email Guardian Owl
              </h1>
              <p className="text-sm text-muted-foreground">Advanced Phishing Detection & Email Security Analysis</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};