import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface CBTLayoutProps {
  children: ReactNode;
  title?: string;
  showProgress?: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  timeRemaining?: string;
}

export const CBTLayout = ({ 
  children, 
  title, 
  showProgress = false, 
  currentQuestion, 
  totalQuestions, 
  timeRemaining 
}: CBTLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">CBT System</h1>
              {title && <p className="text-muted-foreground">{title}</p>}
            </div>
            
            {showProgress && currentQuestion && totalQuestions && (
              <div className="flex items-center gap-6">
                <div className="text-sm text-muted-foreground">
                  Question {currentQuestion} of {totalQuestions}
                </div>
                {timeRemaining && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-warning-light rounded-lg">
                    <div className="w-2 h-2 bg-warning rounded-full"></div>
                    <span className="font-mono text-sm font-medium">{timeRemaining}</span>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {showProgress && currentQuestion && totalQuestions && (
            <div className="mt-4">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
                  style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};