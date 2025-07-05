import React, { useState } from 'react';
import { BarChart3, Link, GitBranch, Share2 } from 'lucide-react';
import ArrayVisualizer from './components/ArrayVisualizer.jsx';
import LinkedListVisualizer from './components/LinkedListVisualizer.jsx';
import TreeVisualizer from './components/TreeVisualizer.jsx';
import GraphVisualizer from './components/GraphVisualizer.jsx';

const App = () => {
  const [activeTab, setActiveTab] = useState('array');

  const tabs = [
    { id: 'array', label: 'Array Sorting', icon: BarChart3, component: ArrayVisualizer },
    { id: 'linkedlist', label: 'Linked List', icon: Link, component: LinkedListVisualizer },
    { id: 'tree', label: 'Binary Tree', icon: GitBranch, component: TreeVisualizer },
    { id: 'graph', label: 'Graph Algorithms', icon: Share2, component: GraphVisualizer }
  ];

  const ActiveComponent = tabs.find(tab => tab.id === activeTab)?.component || ArrayVisualizer;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Algorithm Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Interactive visualization of data structures and algorithms
          </p>
        </div>
        
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-2 shadow-lg border border-white/20">
            <div className="flex space-x-2">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 font-medium
                      ${activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg transform scale-105'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon size={20} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        
        <div className="max-w-6xl mx-auto">
          <ActiveComponent />
        </div>
        
        <div className="text-center mt-12 text-gray-600">
          <p className="text-sm text-gray-500">
            Built with <span className="text-yellow-400">💛</span> by Saket, © All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;