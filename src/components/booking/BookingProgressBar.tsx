
import React from 'react';

interface BookingProgressBarProps {
  currentStep: number;
  steps: string[];
}

const BookingProgressBar: React.FC<BookingProgressBarProps> = ({ currentStep, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between">
        {steps.map((label, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center w-1/4 ${
              index + 1 < currentStep 
                ? 'text-haven-green' 
                : index + 1 === currentStep 
                  ? 'text-haven-green font-medium' 
                  : 'text-gray-400'
            }`}
          >
            <div 
              className={`rounded-full h-8 w-8 flex items-center justify-center mb-2 ${
                index + 1 <= currentStep 
                  ? 'bg-haven-green text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {index + 1}
            </div>
            <span className="text-sm text-center">{label}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-2 h-1 bg-gray-200">
        <div 
          className="absolute top-0 left-0 h-1 bg-haven-green transition-all duration-300" 
          style={{ width: `${(currentStep - 1) * 33.33}%` }}
        />
      </div>
    </div>
  );
};

export default BookingProgressBar;
