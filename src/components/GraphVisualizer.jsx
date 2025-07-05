import React, { useState, useCallback, useEffect } from 'react';
import { bfs, dfs, dijkstra } from '../utils/algorithms.js';
import Controls from './Controls.jsx';
import { Plus, Trash2 } from 'lucide-react';

const GraphVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState('medium');
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('bfs');

  const addNode = useCallback((x, y) => {
    const newNode = {
      id: `node-${Date.now()}`,
      value: String.fromCharCode(65 + nodes.length), // A, B, C, etc.
      x,
      y
    };
    
    setNodes(prev => [...prev, newNode]);
  }, [nodes.length]);

  const addEdge = useCallback((from, to, weight = 1) => {
    const newEdge = {
      from,
      to,
      weight
    };
    
    setEdges(prev => [...prev, newEdge]);
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setNodes(prev => prev.filter(node => node.id !== nodeId));
    setEdges(prev => prev.filter(edge => edge.from !== nodeId && edge.to !== nodeId));
  }, []);

  const handleCanvasClick = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (!isAddingEdge) {
      addNode(x, y);
    }
  }, [addNode, isAddingEdge]);

  const handleNodeClick = useCallback((nodeId, e) => {
    e.stopPropagation();
    
    if (isAddingEdge) {
      if (selectedNode && selectedNode !== nodeId) {
        const weight = selectedAlgorithm === 'dijkstra' 
          ? Math.floor(Math.random() * 10) + 1 
          : 1;
        addEdge(selectedNode, nodeId, weight);
        setSelectedNode(null);
        setIsAddingEdge(false);
      } else {
        setSelectedNode(nodeId);
      }
    } else {
      setSelectedNode(nodeId);
    }
  }, [isAddingEdge, selectedNode, addEdge, selectedAlgorithm]);

  const startAlgorithm = useCallback(() => {
    if (nodes.length === 0 || !selectedNode) return;
    
    let algorithmSteps = [];
    
    switch (selectedAlgorithm) {
      case 'bfs':
        algorithmSteps = bfs(nodes, edges, selectedNode);
        break;
      case 'dfs':
        algorithmSteps = dfs(nodes, edges, selectedNode);
        break;
      case 'dijkstra':
        algorithmSteps = dijkstra(nodes, edges, selectedNode);
        break;
    }
    
    setSteps(algorithmSteps);
    setCurrentStep(0);
  }, [nodes, edges, selectedNode, selectedAlgorithm]);

  const getSpeed = useCallback(() => {
    const speeds = { slow: 1500, medium: 1000, fast: 500 };
    return speeds[speed];
  }, [speed]);

  const applyStep = useCallback((step) => {
    setNodes(prev => {
      const newNodes = prev.map(node => ({
        ...node,
        isActive: false,
        isVisited: false
      }));

      if (step.nodeIds) {
        step.nodeIds.forEach(nodeId => {
          const node = newNodes.find(n => n.id === nodeId);
          if (node) {
            if (step.type === 'visit') {
              node.isVisited = true;
            } else if (step.type === 'highlight') {
              node.isActive = true;
            }
          }
        });
      }

      return newNodes;
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
    }
  }, [isPlaying, currentStep, steps, applyStep, getSpeed]);

  const handlePlay = () => {
    if (steps.length === 0) {
      startAlgorithm();
    }
    setIsPlaying(true);
  };

  const handlePause = () => setIsPlaying(false);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
    setSteps([]);
    setNodes(prev => prev.map(node => ({
      ...node,
      isActive: false,
      isVisited: false
    })));
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
      setNodes(prev => prev.map(node => ({
        ...node,
        isActive: false,
        isVisited: false
      })));
      // Re-apply all steps up to the previous one
      for (let i = 0; i < currentStep - 1; i++) {
        applyStep(steps[i]);
      }
    }
  };

  const clearGraph = () => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setIsAddingEdge(false);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Graph Algorithm Visualizer</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={selectedAlgorithm}
            onChange={(e) => setSelectedAlgorithm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
          >
            <option value="bfs">Breadth-First Search</option>
            <option value="dfs">Depth-First Search</option>
            <option value="dijkstra">Dijkstra's Algorithm</option>
          </select>
          
          <button
            onClick={() => setIsAddingEdge(!isAddingEdge)}
            className={`px-4 py-2 rounded-lg text-white transition-all duration-200 hover:scale-105 flex items-center gap-2 ${
              isAddingEdge ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            <Plus size={16} />
            {isAddingEdge ? 'Cancel Edge' : 'Add Edge'}
          </button>
          
          <button
            onClick={startAlgorithm}
            disabled={!selectedNode}
            className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
          >
            Start Algorithm
          </button>
          
          <button
            onClick={clearGraph}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <Trash2 size={16} />
            Clear Graph
          </button>
        </div>
        
        <div
          className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden cursor-crosshair"
          onClick={handleCanvasClick}
        >
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render edges */}
            {edges.map((edge, index) => {
              const fromNode = nodes.find(n => n.id === edge.from);
              const toNode = nodes.find(n => n.id === edge.to);
              
              if (!fromNode || !toNode) return null;
              
              return (
                <g key={index}>
                  <line
                    x1={fromNode.x}
                    y1={fromNode.y}
                    x2={toNode.x}
                    y2={toNode.y}
                    stroke="#6B7280"
                    strokeWidth="2"
                    markerEnd="url(#arrowhead)"
                  />
                  {selectedAlgorithm === 'dijkstra' && (
                    <text
                      x={(fromNode.x + toNode.x) / 2}
                      y={(fromNode.y + toNode.y) / 2 - 5}
                      textAnchor="middle"
                      className="text-sm font-medium fill-gray-700"
                    >
                      {edge.weight}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* Arrow marker definition */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill="#6B7280"
                />
              </marker>
            </defs>
          </svg>
          
          {/* Render nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`
                absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                transition-all duration-300 transform -translate-x-6 -translate-y-6 cursor-pointer
                ${node.isActive ? 'bg-yellow-500 scale-125' : ''}
                ${node.isVisited ? 'bg-green-500 scale-110' : ''}
                ${selectedNode === node.id ? 'bg-red-500 scale-110' : ''}
                ${!node.isActive && !node.isVisited && selectedNode !== node.id ? 'bg-blue-500' : ''}
                hover:scale-110 shadow-lg
              `}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`
              }}
              onClick={(e) => handleNodeClick(node.id, e)}
            >
              {node.value}
            </div>
          ))}
          
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Click anywhere to add nodes, then add edges between them!
            </div>
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>• Click anywhere to add nodes</p>
          <p>• Click "Add Edge" then click two nodes to connect them</p>
          <p>• Select a node (red) and choose an algorithm to start</p>
          {isAddingEdge && (
            <p className="text-orange-600 font-medium">• Click two nodes to create an edge</p>
          )}
        </div>
        
        {steps.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {currentStep < steps.length 
                ? steps[currentStep]?.description 
                : 'Algorithm complete!'}
            </p>
          </div>
        )}
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

export default GraphVisualizer;