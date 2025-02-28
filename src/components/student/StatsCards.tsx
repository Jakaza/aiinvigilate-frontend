
import React from 'react';
import { BookOpen, Check, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Module, Test } from './types';

interface StatsCardsProps {
  modules: Module[];
  upcomingTests: Test[];
}

const StatsCards: React.FC<StatsCardsProps> = ({ modules, upcomingTests }) => {
  const completedModules = modules.filter(m => m.completionStatus === "completed").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-eduText-light">Total Modules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <BookOpen className="mr-2 h-4 w-4 text-eduAccent" />
            <span className="text-2xl font-bold">{modules.length}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-eduText-light">Completed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <Check className="mr-2 h-4 w-4 text-green-500" />
            <span className="text-2xl font-bold">{completedModules}</span>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-eduText-light">Upcoming Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center">
            <FileText className="mr-2 h-4 w-4 text-orange-500" />
            <span className="text-2xl font-bold">{upcomingTests.length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
