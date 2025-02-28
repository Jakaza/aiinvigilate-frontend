
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText } from 'lucide-react';
import Button from '@/components/ui-custom/Button';
import { Test, TestResult } from './types';
import { formatRemainingTime, getStatusClass } from './utils';

interface ModuleTestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  moduleCode: string | null;
  getModuleTests: (moduleCode: string) => Test[];
  testResults: TestResult[];
  onViewTestResult: (result: TestResult) => void;
}

const ModuleTestsDialog: React.FC<ModuleTestsDialogProps> = ({ 
  open, 
  onOpenChange, 
  moduleCode, 
  getModuleTests, 
  testResults, 
  onViewTestResult 
}) => {
  if (!moduleCode) return null;
  
  const moduleTests = getModuleTests(moduleCode);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            Tests for {moduleCode}
          </DialogTitle>
          <DialogDescription>
            View all tests available for this module.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {moduleTests.length > 0 ? (
            <div className="space-y-4">
              {moduleTests.map((test) => (
                <div key={test.id} className="p-4 border rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{test.name}</h3>
                      <p className="text-sm text-eduText-light">Duration: {test.duration}</p>
                      <p className="text-sm text-eduText-light">
                        Due: {new Date(test.dueDate).toLocaleDateString()} at {new Date(test.dueDate).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(test.status)}`}>
                      {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    {test.status === "pending" && (
                      <Button
                        variant="primary"
                        size="sm"
                        to={`/exam?id=${test.id}`}
                      >
                        Start Test
                      </Button>
                    )}
                    
                    {test.status === "upcoming" && (
                      <p className="text-sm font-medium">
                        Available in {formatRemainingTime(test.dueDate)}
                      </p>
                    )}
                    
                    {test.status === "completed" && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          // Find the test result
                          const result = testResults.find(r => r.name === test.name);
                          if (result) {
                            onOpenChange(false);
                            onViewTestResult(result);
                          }
                        }}
                      >
                        View Results
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-eduText-light opacity-50" />
              <h3 className="mt-4 text-lg font-medium">No Tests Available</h3>
              <p className="mt-2 text-eduText-light">
                There are no tests available for this module at the moment.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModuleTestsDialog;
