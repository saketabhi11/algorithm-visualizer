import React, { useState, useCallback } from 'react';
import { Plus, RotateCcw } from 'lucide-react';

const TreeVisualizer = () => {
  const [nodes, setNodes] = useState([]);
  const [newValue, setNewValue] = useState('');
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [isTraversing, setIsTraversing] = useState(false);

  const calculatePositions = useCallback((nodes) => {
    if (nodes.length === 0) return [];
    
    const positions = new Map();
    const root = nodes[0];
    
    const positionNode = (nodeId, x, y, level) => {
      positions.set(nodeId, { x, y });
      const node = nodes.find(n => n.id === nodeId);
      if (!node) return;
      
      const spacing = Math.max(50, 200 / (level + 1));
      
      if (node.left) {
        positionNode(node.left, x - spacing, y + 80, level + 1);
      }
      if (node.right) {
        positionNode(node.right, x + spacing, y + 80, level + 1);
      }
    };
    
    positionNode(root.id, 300, 50, 0);
    
    return nodes.map(node => ({
      ...node,
      x: positions.get(node.id)?.x || 0,
      y: positions.get(node.id)?.y || 0
    }));
  }, []);

  const insertNode = useCallback((value) => {
    const newNode = {
      id: `node-${Date.now()}`,
      value,
      isActive: true
    };

    setNodes(prev => {
      let newNodes = [...prev];
      
      if (newNodes.length === 0) {
        newNodes = [newNode];
      } else {
        // Simple BST insertion logic
        const insert = (currentId) => {
          const currentNode = newNodes.find(n => n.id === currentId);
          if (!currentNode) return;
          
          if (value < currentNode.value) {
            if (!currentNode.left) {
              currentNode.left = newNode.id;
            } else {
              insert(currentNode.left);
            }
          } else {
            if (!currentNode.right) {
              currentNode.right = newNode.id;
            } else {
              insert(currentNode.right);
            }
          }
        };
        
        insert(newNodes[0].id);
        newNodes.push(newNode);
      }
      
      return calculatePositions(newNodes);
    });

    // Clear the active state after animation
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        isActive: false
      })));
    }, 1000);
  }, [calculatePositions]);

  const inOrderTraversal = useCallback((nodeId, nodes) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    const result = [];
    if (node.left) result.push(...inOrderTraversal(node.left, nodes));
    result.push(nodeId);
    if (node.right) result.push(...inOrderTraversal(node.right, nodes));
    
    return result;
  }, []);

  const preOrderTraversal = useCallback((nodeId, nodes) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    const result = [nodeId];
    if (node.left) result.push(...preOrderTraversal(node.left, nodes));
    if (node.right) result.push(...preOrderTraversal(node.right, nodes));
    
    return result;
  }, []);

  const postOrderTraversal = useCallback((nodeId, nodes) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return [];
    
    const result = [];
    if (node.left) result.push(...postOrderTraversal(node.left, nodes));
    if (node.right) result.push(...postOrderTraversal(node.right, nodes));
    result.push(nodeId);
    
    return result;
  }, []);

  const startTraversal = useCallback((type) => {
    if (nodes.length === 0) return;
    
    setIsTraversing(true);
    
    let order = [];
    switch (type) {
      case 'inorder':
        order = inOrderTraversal(nodes[0].id, nodes);
        break;
      case 'preorder':
        order = preOrderTraversal(nodes[0].id, nodes);
        break;
      case 'postorder':
        order = postOrderTraversal(nodes[0].id, nodes);
        break;
    }
    
    setTraversalOrder(order);
    
    order.forEach((nodeId, index) => {
      setTimeout(() => {
        setNodes(prev => prev.map(node => ({
          ...node,
          isVisited: node.id === nodeId,
          isActive: node.id === nodeId
        })));
      }, index * 800);
    });
    
    setTimeout(() => {
      setNodes(prev => prev.map(node => ({
        ...node,
        isVisited: false,
        isActive: false
      })));
      setIsTraversing(false);
    }, order.length * 800 + 1000);
  }, [nodes, inOrderTraversal, preOrderTraversal, postOrderTraversal]);

  const handleAddNode = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      insertNode(value);
      setNewValue('');
    }
  };

  const clearTree = () => {
    setNodes([]);
    setTraversalOrder([]);
  };

  const getEdges = () => {
    const edges = [];
    for (const node of nodes) {
      if (node.left) {
        const leftChild = nodes.find(n => n.id === node.left);
        if (leftChild) {
          edges.push({
            from: { x: node.x, y: node.y },
            to: { x: leftChild.x, y: leftChild.y }
          });
        }
      }
      if (node.right) {
        const rightChild = nodes.find(n => n.id === node.right);
        if (rightChild) {
          edges.push({
            from: { x: node.x, y: node.y },
            to: { x: rightChild.x, y: rightChild.y }
          });
        }
      }
    }
    return edges;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-md rounded-xl p-6 shadow-lg border border-white/20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Binary Tree Visualizer</h2>
        
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
            <button
              onClick={() => startTraversal('inorder')}
              disabled={isTraversing}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              In-Order
            </button>
            <button
              onClick={() => startTraversal('preorder')}
              disabled={isTraversing}
              className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              Pre-Order
            </button>
            <button
              onClick={() => startTraversal('postorder')}
              disabled={isTraversing}
              className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105"
            >
              Post-Order
            </button>
          </div>
          
          <button
            onClick={clearTree}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all duration-200 hover:scale-105 flex items-center gap-2"
          >
            <RotateCcw size={16} />
            Clear Tree
          </button>
        </div>
        
        <div className="relative w-full h-96 bg-gray-50 rounded-lg overflow-hidden">
          <svg width="100%" height="100%" className="absolute inset-0">
            {/* Render edges */}
            {getEdges().map((edge, index) => (
              <line
                key={index}
                x1={edge.from.x}
                y1={edge.from.y + 16}
                x2={edge.to.x}
                y2={edge.to.y + 16}
                stroke="#6B7280"
                strokeWidth="2"
              />
            ))}
          </svg>
          
          {/* Render nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`
                absolute w-12 h-12 rounded-full flex items-center justify-center text-white font-bold
                transition-all duration-500 transform -translate-x-6 -translate-y-6
                ${node.isActive ? 'bg-yellow-500 scale-125' : ''}
                ${node.isVisited ? 'bg-green-500 scale-110' : ''}
                ${!node.isActive && !node.isVisited ? 'bg-blue-500' : ''}
                hover:scale-110 cursor-pointer shadow-lg
              `}
              style={{
                left: `${node.x}px`,
                top: `${node.y}px`
              }}
            >
              {node.value}
            </div>
          ))}
          
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              Add nodes to build your binary search tree!
            </div>
          )}
        </div>
        
        {traversalOrder.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Traversal Order:</strong> {traversalOrder.map(nodeId => {
                const node = nodes.find(n => n.id === nodeId);
                return node?.value;
              }).join(' → ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TreeVisualizer;