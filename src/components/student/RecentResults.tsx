
import React from 'react';
import { Award } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Progress } from "@/components/ui/progress";
import { TestResult } from './types';

interface RecentResultsProps {
  results: TestResult[];
  onViewDetails: (result: TestResult) => void;
  onViewAll: () => void;
}

const RecentResults: React.FC<RecentResultsProps> = ({ results, onViewDetails, onViewAll }) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Award className="mr-2 h-5 w-5 text-eduAccent" />
        Recent Results
      </h3>
      
      <div className="space-y-4">
        {results.slice(0, 3).map((result) => (
          <div key={result.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{result.name}</h4>
                <p className="text-sm text-eduText-light">{result.module} • {new Date(result.date).toLocaleDateString()}</p>
              </div>
              <span className="text-lg font-bold">
                {result.score}%
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Score</span>
                <span>{result.score}/{result.maxScore}</span>
              </div>
              <Progress value={(result.score / result.maxScore) * 100} className="h-2" />
            </div>
            <div className="mt-3 text-right">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(result)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center">
        <Button 
          variant="ghost" 
          onClick={onViewAll}
        >
          View All Results
        </Button>
      </div>
    </GlassCard>
  );
};

export default RecentResults;
