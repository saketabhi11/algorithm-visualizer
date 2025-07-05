import React from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

const Controls = ({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onNext,
  onPrevious,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps
}) => {
  const speedOptions = [
    { value: 'slow', label: 'Slow' },
    { value: 'medium', label: 'Medium' },
    { value: 'fast', label: 'Fast' }
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={currentStep === 0}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={isPlaying ? onPause : onPlay}
            className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 transition-all duration-200 hover:scale-105 shadow-lg"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          
          <button
            onClick={onNext}
            disabled={currentStep >= totalSteps - 1}
            className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            <SkipForward size={20} />
          </button>
          
          <button
            onClick={onReset}
            className="p-2 rounded-lg bg-gray-500 text-white hover:bg-gray-600 transition-all duration-200 hover:scale-105"
          >
            <RotateCcw size={20} />
          </button>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            Step {currentStep + 1} of {totalSteps}
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Speed:</span>
            <select
              value={speed}
              onChange={(e) => onSpeedChange(e.target.value)}
              className="px-3 py-1 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
            >
              {speedOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default Controls;