import React from 'react';

export default function WelcomeSection() {
  return (
    <div className="rounded-2xl p-8 relative overflow-hidden bg-secondary" data-testid="welcome-section">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-secondary-foreground mb-2" data-testid="text-welcome-message">
            Welcome back, Chetan!
          </h2>
          <p className="text-secondary-foreground/70 mb-1" data-testid="text-streak-info">
            This week you have been studying for 4 consecutive days!
          </p>
          <p className="text-secondary-foreground font-semibold" data-testid="text-encouragement">
            Keep it up and improve!
          </p>
        </div>
        <div className="hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=300" 
            alt="Chetan's profile" 
            className="w-32 h-32 object-cover rounded-full"
            data-testid="img-student-illustration"
          />
        </div>
      </div>
    </div>
  );
}
