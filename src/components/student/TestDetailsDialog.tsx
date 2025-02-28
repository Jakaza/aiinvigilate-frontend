
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { TestResult, QuestionDetail } from './types';

interface TestDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  test: TestResult | null;
  getTestDetails: (testId: number) => QuestionDetail[];
}

const TestDetailsDialog: React.FC<TestDetailsDialogProps> = ({ 
  open, 
  onOpenChange, 
  test, 
  getTestDetails 
}) => {
  if (!test) return null;
  
  const testDetails = getTestDetails(test.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {test.name}
          </DialogTitle>
          <DialogDescription>
            Test results and feedback
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-between mb-6">
            <div>
              <h3 className="font-medium text-sm mb-1">Module</h3>
              <p>{test.module}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Date</h3>
              <p>{new Date(test.date).toLocaleDateString()}</p>
            </div>
            <div>
              <h3 className="font-medium text-sm mb-1">Score</h3>
              <p className="font-bold text-lg">{test.score}/{test.maxScore} ({test.score}%)</p>
            </div>
          </div>
          
          <div className="mb-6">
            <Progress value={(test.score / test.maxScore) * 100} className="h-2 w-full mb-1" />
            <div className="flex justify-between text-xs text-eduText-light">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-4">Question Breakdown</h3>
            <div className="space-y-4">
              {testDetails.map((question, index) => (
                <div key={question.id} className={`p-4 border rounded-md ${question.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">Question {index + 1}</h4>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {question.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <p className="mb-4">{question.question}</p>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm font-medium">Your Answer:</span>
                      <p className={question.isCorrect ? 'text-green-700' : 'text-red-700'}>
                        {question.yourAnswer}
                      </p>
                    </div>
                    {!question.isCorrect && (
                      <div>
                        <span className="text-sm font-medium">Correct Answer:</span>
                        <p className="text-green-700">{question.correctAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TestDetailsDialog;
