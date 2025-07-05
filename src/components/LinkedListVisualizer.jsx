import React, { useState, useCallback } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';

const LinkedListVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [animatingNode, setAnimatingNode] = useState(null);

  const addNode = useCallback((value, position = 'tail') => {
    const newNode = {
      id: `node-${Date.now()}`,
      value,
      isHighlighted: true
    };

    setNodes(prev => {
      const newNodes = [...prev];
      
      if (position === 'head') {
        if (newNodes.length > 0) {
          newNode.next = newNodes[0].id;
        }
        newNodes.unshift(newNode);
      } else {
        if (newNodes.length > 0) {
          newNodes[newNodes.length - 1].next = newNode.id;
        }
        newNodes.push(newNode);
      }
      
      return newNodes;
    });

    setAnimatingNode(newNode.id);
    setTimeout(() => {
      setAnimatingNode(null);
      setNodes(prev => prev.map(node => 
        node.id === newNode.id 
          ? { ...node, isHighlighted: false }
          : node
      ));
    }, 1000);
  }, []);

  const deleteNode = useCallback((nodeId) => {
    setAnimatingNode(nodeId);
    
    setTimeout(() => {
      setNodes(prev => {
        const nodeIndex = prev.findIndex(node => node.id === nodeId);
        if (nodeIndex === -1) return prev;
        
        const newNodes = [...prev];
        
        // Update the previous node's next pointer
        if (nodeIndex > 0) {
          newNodes[nodeIndex - 1].next = newNodes[nodeIndex].next;
        }
        
        // Remove the node
        newNodes.splice(nodeIndex, 1);
        
        return newNodes;
      });
      setAnimatingNode(null);
    }, 500);
  }, []);

  const searchNode = useCallback((value) => {
    const nodeIndex = nodes.findIndex(node => node.value === value);
    
    if (nodeIndex !== -1) {
      // Animate the search
      for (let i = 0; i <= nodeIndex; i++) {
        setTimeout(() => {
          setNodes(prev => prev.map((node, index) => ({
            ...node,
            isActive: index === i,
            isHighlighted: index === nodeIndex && i === nodeIndex
          })));
        }, i * 300);
      }
      
      // Clear highlights after animation
      setTimeout(() => {
        setNodes(prev => prev.map(node => ({
          ...node,
          isActive: false,
          isHighlighted: false
        })));
      }, (nodeIndex + 1) * 300 + 1000);
    }
  }, [nodes]);

  const handleAddNode = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      addNode(value);
      setNewValue('');
    }
  };

  const handleSearch = () => {
    const value = parseInt(searchValue);
    if (!isNaN(value)) {
      searchNode(value);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Linked List Visualizer</h2>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Enter value"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
            />
            <button
              onClick={handleAddNode}
              className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Plus size={16} />
              Add Node
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search value"
              className="px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/80 backdrop-blur-sm"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200 hover:scale-105 flex items-center gap-2"
            >
              <Search size={16} />
              Search
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg overflow-x-auto min-h-32">
          {nodes.length === 0 ? (
            <div className="text-gray-500 text-center w-full">
              No nodes in the list. Add some nodes to get started!
            </div>
          ) : (
            nodes.map((node, index) => (
              <div key={node.id} className="flex items-center gap-4">
                <div
                  className={`
                    relative w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold
                    transition-all duration-500 transform
                    ${node.isActive ? 'bg-yellow-500 scale-110' : ''}
                    ${node.isHighlighted ? 'bg-green-500 scale-110' : ''}
                    ${!node.isActive && !node.isHighlighted ? 'bg-blue-500' : ''}
                    ${animatingNode === node.id ? 'animate-pulse scale-125' : ''}
                    hover:scale-105 cursor-pointer
                  `}
                  onClick={() => deleteNode(node.id)}
                >
                  {node.value}
                  <button
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center transition-all duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
                
                {index < nodes.length - 1 && (
                  <div className="flex items-center">
                    <div className="w-8 h-0.5 bg-gray-400"></div>
                    <div className="w-0 h-0 border-l-4 border-l-gray-400 border-y-2 border-y-transparent"></div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>• Click on a node to delete it</p>
          <p>• Use search to find a specific value</p>
          <p>• Nodes are added to the tail by default</p>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;