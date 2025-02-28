
import React from 'react';
import { Clock, AlarmClock } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Test } from './types';
import { formatRemainingTime, getStatusClass } from './utils';

interface UpcomingTestsProps {
  tests: Test[];
}

const UpcomingTests: React.FC<UpcomingTestsProps> = ({ tests }) => {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="mr-2 h-5 w-5 text-eduAccent" />
        Upcoming Tests
      </h3>
      
      {tests.length > 0 ? (
        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{test.name}</h4>
                  <p className="text-sm text-eduText-light">{test.module} • {test.duration}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  test.status === "pending" ? "bg-orange-100 text-orange-800" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {test.status === "pending" ? "Ready to Take" : "Upcoming"}
                </span>
              </div>
              <div className="mt-3 flex items-center">
                <AlarmClock className="h-4 w-4 text-eduText-light mr-1" />
                <span className="text-sm font-medium">
                  {formatRemainingTime(test.dueDate)} remaining
                </span>
              </div>
              <div className="mt-3">
                <Button 
                  variant={test.status === "pending" ? "primary" : "secondary"} 
                  size="sm"
                  className="w-full"
                  to={test.status === "pending" ? `/exam?id=${test.id}` : "#"}
                  disabled={test.status !== "pending"}
                >
                  {test.status === "pending" ? "Start Test" : "View Details"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Clock className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
          <h3 className="mt-4 text-lg font-medium">No Upcoming Tests</h3>
          <p className="mt-2 text-eduText-light">
            You don't have any upcoming tests at the moment.
          </p>
        </div>
      )}
    </GlassCard>
  );
};

export default UpcomingTests;
