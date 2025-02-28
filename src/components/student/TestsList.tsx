
import React from 'react';
import { FileText, Clock, Calendar } from 'lucide-react';
import GlassCard from '@/components/ui-custom/GlassCard';
import Button from '@/components/ui-custom/Button';
import { Test, TestResult } from './types';
import { formatRemainingTime, getStatusClass } from './utils';

interface TestsListProps {
  tests: Test[];
  testResults: TestResult[];
}

const TestsList: React.FC<TestsListProps> = ({ tests, testResults }) => {
  return (
    <GlassCard className="p-6">
      <h2 className="text-xl font-semibold flex items-center mb-6">
        <FileText className="mr-2 h-5 w-5 text-eduAccent" />
        Available Tests
      </h2>
      
      <div className="space-y-6">
        {tests.length > 0 ? (
          tests.map((test) => (
            <div key={test.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h3 className="font-semibold text-lg">{test.name}</h3>
                  <p className="text-eduText-light mt-1">Module: {test.module}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-1 text-eduText-light" />
                      <span>{test.duration}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-eduText-light" />
                      <span>{new Date(test.dueDate).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0">
                  {test.status === "pending" && (
                    <Button
                      variant="primary"
                      to={`/exam?id=${test.id}`}
                    >
                      Start Test
                    </Button>
                  )}
                  
                  {test.status === "upcoming" && (
                    <div className="text-right md:text-center">
                      <p className="text-sm font-medium mb-2">
                        Available in {formatRemainingTime(test.dueDate)}
                      </p>
                      <Button
                        variant="secondary"
                        to={`/test-details?id=${test.id}&role=student`}
                      >
                        View Details
                      </Button>
                    </div>
                  )}
                  
                  {test.status === "completed" && (
                    <Button
                      variant="secondary"
                      to={`/results?test=${test.id}`}
                    >
                      View Results
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
            <h3 className="mt-4 text-lg font-medium">No Tests Available</h3>
            <p className="mt-2 text-eduText-light">
              There are no tests available for you at the moment.
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
};

export default TestsList;
