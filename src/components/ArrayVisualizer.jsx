import React, { useState, useEffect, useCallback } from 'react';
import { bubbleSort, quickSort, mergeSort, selectionSort, insertionSort, heapSort } from '../utils/algorithms.js';
import Controls from './Controls.jsx';

const ArrayVisualizer = () => {
  const [array, setArray] = useState([]);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('medium');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bubble');

  const algorithms = [
    { value: 'bubble', label: 'Bubble Sort', color: 'from-blue-500 to-cyan-500' },
    { value: 'quick', label: 'Quick Sort', color: 'from-purple-500 to-pink-500' },
    { value: 'merge', label: 'Merge Sort', color: 'from-green-500 to-emerald-500' },
    { value: 'selection', label: 'Selection Sort', color: 'from-orange-500 to-red-500' },
    { value: 'insertion', label: 'Insertion Sort', color: 'from-indigo-500 to-blue-500' },
    { value: 'heap', label: 'Heap Sort', color: 'from-rose-500 to-pink-500' }
  ];

  const generateRandomArray = useCallback((size = 20) => {
    const newArray = [];
    for (let i = 0; i < size; i++) {
      newArray.push({
        id: `elem-${i}`,
        value: Math.floor(Math.random() * 300) + 10,
        isComparing: false,
        isSwapping: false,
        isSorted: false,
        isHighlighted: false
      });
    }
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  const startSorting = useCallback(() => {
    if (array.length === 0) return;
    
    let sortSteps = [];
    
    switch (selectedAlgorithm) {
      case 'bubble':
        sortSteps = bubbleSort(array);
        break;
      case 'quick':
        sortSteps = quickSort([...array]);
        break;
      case 'merge':
        sortSteps = mergeSort([...array]);
        break;
      case 'selection':
        sortSteps = selectionSort([...array]);
        break;
      case 'insertion':
        sortSteps = insertionSort([...array]);
        break;
      case 'heap':
        sortSteps = heapSort([...array]);
        break;
      default:
        sortSteps = bubbleSort(array);
    }
    
    setSteps(sortSteps);
    setCurrentStep(0);
  }, [array, selectedAlgorithm]);

  const getSpeed = useCallback(() => {
    const speeds = { slow: 1000, medium: 500, fast: 200 };
    return speeds[speed];
  }, [speed]);

  const applyStep = useCallback((step) => {
    setArray(prev => {
      const newArray = prev.map(elem => ({
        ...elem,
        isComparing: false,
        isSwapping: false,
        isActive: false,
        isHighlighted: false
      }));

      if (step.type === 'compare' && step.indices) {
        step.indices.forEach(index => {
          if (newArray[index]) {
            newArray[index].isComparing = true;
          }
        });
      } else if (step.type === 'swap' && step.indices) {
        if (step.indices.length === 2) {
          const [i, j] = step.indices;
          step.indices.forEach(index => {
            if (newArray[index]) {
              newArray[index].isSwapping = true;
            }
          });
          // Perform the actual swap
          [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        } else if (step.indices.length === 1) {
          // For single element operations (like in merge sort)
          const index = step.indices[0];
          if (newArray[index]) {
            newArray[index].isSwapping = true;
          }
        }
      } else if (step.type === 'highlight' && step.indices) {
        step.indices.forEach(index => {
          if (newArray[index]) {
            newArray[index].isHighlighted = true;
          }
        });
      } else if (step.type === 'sort' && step.indices) {
        step.indices.forEach(index => {
          if (newArray[index]) {
            newArray[index].isSorted = true;
          }
        });
      }

      return newArray;
    });
  }, []);

  useEffect(() => {
    if (isPlaying && currentStep < steps.length) {
      const timer = setTimeout(() => {
        applyStep(steps[currentStep]);
        setCurrentStep(prev => prev + 1);
      }, getSpeed());

      return () => clearTimeout(timer);
    } else if (currentStep >= steps.length) {
      setIsPlaying(false);
      // Mark all as sorted
      setArray(prev => prev.map(elem => ({ ...elem, isSorted: true })));
    }
  }, [isPlaying, currentStep, steps, applyStep, getSpeed]);

  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  const handlePlay = () => {
    if (steps.length === 0) {
      startSorting();
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    generateRandomArray();
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      applyStep(steps[currentStep]);
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      generateRandomArray();
      // Re-apply all steps up to the previous one
      for (let i = 0; i < currentStep - 1; i++) {
        applyStep(steps[i]);
      }
    }
  };

  const maxValue = Math.max(...array.map(elem => elem.value));
  const currentAlgorithm = algorithms.find(alg => alg.value === selectedAlgorithm);

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Array Sorting Visualizer</h2>
          <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${currentAlgorithm?.color} text-white font-medium shadow-lg`}>
            {currentAlgorithm?.label}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm font-medium"
          >
            {algorithms.map(alg => (
              <option key={alg.value} value={alg.value}>
                {alg.label}
              </option>
            ))}
          </select>
          
          <button
            onClick={() => generateRandomArray(15)}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-200 hover:scale-105 font-medium shadow-md"
          >
            Generate New Array
          </button>
          
          <button
            onClick={startSorting}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-105 font-medium shadow-md"
          >
            Prepare Sort
          </button>
        </div>
        
        <div className="flex items-end justify-center gap-1 h-80 p-4 bg-gray-50 rounded-lg overflow-hidden">
          {array.map((element, index) => (
            <div
              key={`${element.id}-${index}`}
              className={`
                flex-1 max-w-8 rounded-t-lg transition-all duration-300 transform relative
                ${element.isComparing ? 'bg-yellow-400 scale-110 shadow-lg' : ''}
                ${element.isSwapping ? 'bg-red-400 scale-110 shadow-lg' : ''}
                ${element.isHighlighted ? 'bg-purple-400 scale-105 shadow-md' : ''}
                ${element.isSorted ? 'bg-green-400 shadow-md' : ''}
                ${!element.isComparing && !element.isSwapping && !element.isSorted && !element.isHighlighted ? 'bg-blue-400' : ''}
                hover:scale-105
              `}
              style={{
                height: `${(element.value / maxValue) * 100}%`,
                minHeight: '20px'
              }}
            >
              <div className="text-xs text-white font-semibold text-center mt-1">
                {element.value}
              </div>
              {element.isComparing && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
              )}
              {element.isSwapping && (
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
              )}
            </div>
          ))}
        </div>
        
        {steps.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800 font-medium">
              {currentStep < steps.length 
                ? steps[currentStep]?.description 
                : 'Sorting complete! 🎉'}
            </p>
          </div>
        )}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span>Comparing elements</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-400 rounded"></div>
            <span>Swapping elements</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-400 rounded"></div>
            <span>Highlighted/Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-400 rounded"></div>
            <span>Sorted position</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-400 rounded"></div>
            <span>Unsorted elements</span>
          </div>
        </div>
      </div>
      
      {steps.length > 0 && (
        <Controls
          isPlaying={isPlaying}
          onPlay={handlePlay}
          onPause={handlePause}
          onReset={handleReset}
          onNext={handleNext}
          onPrevious={handlePrevious}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStep}
          totalSteps={steps.length}
        />
      )}
    </div>
  );
};

export default ArrayVisualizer;