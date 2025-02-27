
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GlassCard from '../ui-custom/GlassCard';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';

interface OptionProps {
  id: string;
  text: string;
  isSelected: boolean;
  onSelect: () => void;
}

const Option = ({ id, text, isSelected, onSelect }: OptionProps) => {
  return (
    <div
      onClick={onSelect}
      className={cn(
        'relative p-4 mb-3 rounded-lg border transition-all duration-300 cursor-pointer group hover:border-eduAccent',
        isSelected 
          ? 'border-eduAccent bg-eduAccent/5' 
          : 'border-eduPrimary-dark bg-white'
      )}
    >
      <div className="flex items-start">
        <div 
          className={cn(
            'flex-shrink-0 w-5 h-5 mr-3 flex items-center justify-center rounded-full border transition-all',
            isSelected 
              ? 'border-eduAccent bg-eduAccent text-white' 
              : 'border-eduText-light/30 group-hover:border-eduAccent/50'
          )}
        >
          {isSelected && <Check className="w-3 h-3" />}
        </div>
        <span className="text-eduText-dark">{text}</span>
      </div>
    </div>
  );
};

interface QuestionCardProps {
  question: {
    id: number;
    text: string;
    options: { id: string; text: string }[];
  };
  totalQuestions: number;
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onAnswer: (questionId: number, optionId: string) => void;
  selectedAnswer?: string;
}

const QuestionCard = ({
  question,
  totalQuestions,
  currentIndex,
  onNext,
  onPrev,
  onAnswer,
  selectedAnswer,
}: QuestionCardProps) => {
  const [selectedOption, setSelectedOption] = useState(selectedAnswer || '');

  const handleSelectOption = (optionId: string) => {
    setSelectedOption(optionId);
    onAnswer(question.id, optionId);
  };

  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <GlassCard className="w-full max-w-3xl mx-auto overflow-hidden animate-scale-in">
      <div className="h-1.5 bg-eduPrimary-dark">
        <div 
          className="h-full bg-eduAccent transition-all duration-300 ease-in-out" 
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-eduText-light">
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded bg-eduPrimary">
            {Math.round(progress)}% Complete
          </span>
        </div>
        
        <h3 className="text-xl font-medium mb-6">{question.text}</h3>
        
        <div className="space-y-2">
          {question.options.map((option) => (
            <Option
              key={option.id}
              id={option.id}
              text={option.text}
              isSelected={selectedOption === option.id}
              onSelect={() => handleSelectOption(option.id)}
            />
          ))}
        </div>
        
        <div className="flex justify-between mt-8">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className={cn(
              'flex items-center px-4 py-2 rounded text-sm font-medium transition-all',
              currentIndex === 0
                ? 'opacity-50 cursor-not-allowed text-eduText-light'
                : 'text-eduText hover:text-eduAccent'
            )}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          
          <button
            onClick={onNext}
            className="flex items-center px-4 py-2 bg-eduAccent text-white rounded text-sm font-medium hover:bg-eduAccent-dark transition-all"
          >
            {currentIndex === totalQuestions - 1 ? 'Submit' : 'Next'}
            {currentIndex < totalQuestions - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};

export default QuestionCard;
