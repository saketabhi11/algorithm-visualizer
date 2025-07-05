/**
 * Bubble sort algorithm implementation
 * @param {import('../types/index.js').ArrayElement[]} arr 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const bubbleSort = (arr) => {
  const steps = [];
  const sortedArr = [...arr];
  
  for (let i = 0; i < sortedArr.length - 1; i++) {
    for (let j = 0; j < sortedArr.length - i - 1; j++) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing elements at positions ${j} and ${j + 1}`
      });
      
      if (sortedArr[j].value > sortedArr[j + 1].value) {
        steps.push({
          type: 'swap',
          indices: [j, j + 1],
          description: `Swapping elements at positions ${j} and ${j + 1}`
        });
        [sortedArr[j], sortedArr[j + 1]] = [sortedArr[j + 1], sortedArr[j]];
      }
    }
    steps.push({
      type: 'sort',
      indices: [sortedArr.length - i - 1],
      description: `Element at position ${sortedArr.length - i - 1} is in correct position`
    });
  }
  
  steps.push({
    type: 'sort',
    indices: [0],
    description: 'Array is completely sorted!'
  });
  
  return steps;
};

/**
 * Quick sort algorithm implementation
 * @param {import('../types/index.js').ArrayElement[]} arr 
 * @param {number} low 
 * @param {number} high 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const quickSort = (arr, low = 0, high = arr.length - 1) => {
  const steps = [];
  
  const partition = (arr, low, high) => {
    const pivot = arr[high].value;
    let i = low - 1;
    
    steps.push({
      type: 'highlight',
      indices: [high],
      description: `Choosing pivot: ${pivot}`
    });
    
    for (let j = low; j < high; j++) {
      steps.push({
        type: 'compare',
        indices: [j, high],
        description: `Comparing ${arr[j].value} with pivot ${pivot}`
      });
      
      if (arr[j].value < pivot) {
        i++;
        if (i !== j) {
          steps.push({
            type: 'swap',
            indices: [i, j],
            description: `Swapping ${arr[i].value} and ${arr[j].value}`
          });
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
      }
    }
    
    steps.push({
      type: 'swap',
      indices: [i + 1, high],
      description: `Placing pivot in correct position`
    });
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    
    return i + 1;
  };
  
  const quickSortHelper = (arr, low, high) => {
    if (low < high) {
      const pi = partition(arr, low, high);
      quickSortHelper(arr, low, pi - 1);
      quickSortHelper(arr, pi + 1, high);
    }
  };
  
  quickSortHelper(arr, low, high);
  
  return steps;
};

/**
 * Merge sort algorithm implementation
 * @param {import('../types/index.js').ArrayElement[]} arr 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const mergeSort = (arr) => {
  const steps = [];
  const sortedArr = [...arr];
  
  const merge = (arr, left, mid, right) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    steps.push({
      type: 'highlight',
      indices: Array.from({length: right - left + 1}, (_, i) => left + i),
      description: `Merging subarrays from ${left} to ${mid} and ${mid + 1} to ${right}`
    });
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      steps.push({
        type: 'compare',
        indices: [left + i, mid + 1 + j],
        description: `Comparing ${leftArr[i].value} and ${rightArr[j].value}`
      });
      
      if (leftArr[i].value <= rightArr[j].value) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      
      steps.push({
        type: 'swap',
        indices: [k],
        description: `Placing ${arr[k].value} at position ${k}`
      });
      k++;
    }
    
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        type: 'swap',
        indices: [k],
        description: `Placing remaining ${arr[k].value} at position ${k}`
      });
      i++;
      k++;
    }
    
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        type: 'swap',
        indices: [k],
        description: `Placing remaining ${arr[k].value} at position ${k}`
      });
      j++;
      k++;
    }
  };
  
  const mergeSortHelper = (arr, left, right) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      
      steps.push({
        type: 'highlight',
        indices: Array.from({length: right - left + 1}, (_, i) => left + i),
        description: `Dividing array from ${left} to ${right}`
      });
      
      mergeSortHelper(arr, left, mid);
      mergeSortHelper(arr, mid + 1, right);
      merge(arr, left, mid, right);
    }
  };
  
  mergeSortHelper(sortedArr, 0, sortedArr.length - 1);
  
  steps.push({
    type: 'sort',
    indices: Array.from({length: sortedArr.length}, (_, i) => i),
    description: 'Merge sort complete!'
  });
  
  return steps;
};

/**
 * Selection sort algorithm implementation
 * @param {import('../types/index.js').ArrayElement[]} arr 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const selectionSort = (arr) => {
  const steps = [];
  const sortedArr = [...arr];
  
  for (let i = 0; i < sortedArr.length - 1; i++) {
    let minIndex = i;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      description: `Starting new pass, current position: ${i}`
    });
    
    for (let j = i + 1; j < sortedArr.length; j++) {
      steps.push({
        type: 'compare',
        indices: [minIndex, j],
        description: `Comparing ${sortedArr[minIndex].value} with ${sortedArr[j].value}`
      });
      
      if (sortedArr[j].value < sortedArr[minIndex].value) {
        minIndex = j;
        steps.push({
          type: 'highlight',
          indices: [minIndex],
          description: `New minimum found: ${sortedArr[minIndex].value} at position ${minIndex}`
        });
      }
    }
    
    if (minIndex !== i) {
      steps.push({
        type: 'swap',
        indices: [i, minIndex],
        description: `Swapping ${sortedArr[i].value} with minimum ${sortedArr[minIndex].value}`
      });
      [sortedArr[i], sortedArr[minIndex]] = [sortedArr[minIndex], sortedArr[i]];
    }
    
    steps.push({
      type: 'sort',
      indices: [i],
      description: `Position ${i} is now sorted with value ${sortedArr[i].value}`
    });
  }
  
  steps.push({
    type: 'sort',
    indices: [sortedArr.length - 1],
    description: 'Selection sort complete!'
  });
  
  return steps;
};

/**
 * Insertion sort algorithm implementation
 * @param {import('../types/index.js').ArrayElement[]} arr 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const insertionSort = (arr) => {
  const steps = [];
  const sortedArr = [...arr];
  
  steps.push({
    type: 'sort',
    indices: [0],
    description: 'First element is considered sorted'
  });
  
  for (let i = 1; i < sortedArr.length; i++) {
    const key = sortedArr[i];
    let j = i - 1;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      description: `Inserting ${key.value} into sorted portion`
    });
    
    while (j >= 0 && sortedArr[j].value > key.value) {
      steps.push({
        type: 'compare',
        indices: [j, j + 1],
        description: `Comparing ${sortedArr[j].value} with ${key.value}`
      });
      
      sortedArr[j + 1] = sortedArr[j];
      steps.push({
        type: 'swap',
        indices: [j + 1],
        description: `Moving ${sortedArr[j].value} one position right`
      });
      
      j--;
    }
    
    sortedArr[j + 1] = key;
    steps.push({
      type: 'swap',
      indices: [j + 1],
      description: `Placing ${key.value} at position ${j + 1}`
    });
    
    steps.push({
      type: 'sort',
      indices: Array.from({length: i + 1}, (_, k) => k),
      description: `First ${i + 1} elements are now sorted`
    });
  }
  
  return steps;
};

/**
 * Heap sort algorithm implementation
 * @param {import('../types/index.js').ArrayElement[]} arr 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const heapSort = (arr) => {
  const steps = [];
  const sortedArr = [...arr];
  const n = sortedArr.length;
  
  const heapify = (arr, n, i) => {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    steps.push({
      type: 'highlight',
      indices: [i],
      description: `Heapifying at index ${i}`
    });
    
    if (left < n) {
      steps.push({
        type: 'compare',
        indices: [left, largest],
        description: `Comparing left child ${arr[left].value} with parent ${arr[largest].value}`
      });
      
      if (arr[left].value > arr[largest].value) {
        largest = left;
      }
    }
    
    if (right < n) {
      steps.push({
        type: 'compare',
        indices: [right, largest],
        description: `Comparing right child ${arr[right].value} with current largest ${arr[largest].value}`
      });
      
      if (arr[right].value > arr[largest].value) {
        largest = right;
      }
    }
    
    if (largest !== i) {
      steps.push({
        type: 'swap',
        indices: [i, largest],
        description: `Swapping ${arr[i].value} with ${arr[largest].value} to maintain heap property`
      });
      [arr[i], arr[largest]] = [arr[largest], arr[i]];
      heapify(arr, n, largest);
    }
  };
  
  // Build max heap
  steps.push({
    type: 'highlight',
    indices: Array.from({length: n}, (_, i) => i),
    description: 'Building max heap from array'
  });
  
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(sortedArr, n, i);
  }
  
  // Extract elements from heap one by one
  for (let i = n - 1; i > 0; i--) {
    steps.push({
      type: 'swap',
      indices: [0, i],
      description: `Moving largest element ${sortedArr[0].value} to position ${i}`
    });
    [sortedArr[0], sortedArr[i]] = [sortedArr[i], sortedArr[0]];
    
    steps.push({
      type: 'sort',
      indices: [i],
      description: `Element at position ${i} is now in final position`
    });
    
    heapify(sortedArr, i, 0);
  }
  
  steps.push({
    type: 'sort',
    indices: [0],
    description: 'Heap sort complete!'
  });
  
  return steps;
};

/**
 * Breadth-first search algorithm
 * @param {import('../types/index.js').GraphNode[]} nodes 
 * @param {import('../types/index.js').GraphEdge[]} edges 
 * @param {string} startId 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const bfs = (nodes, edges, startId) => {
  const steps = [];
  const visited = new Set();
  const queue = [startId];
  
  steps.push({
    type: 'visit',
    nodeIds: [startId],
    description: `Starting BFS from node ${startId}`
  });
  
  while (queue.length > 0) {
    const currentId = queue.shift();
    
    if (visited.has(currentId)) continue;
    
    visited.add(currentId);
    steps.push({
      type: 'visit',
      nodeIds: [currentId],
      description: `Visiting node ${currentId}`
    });
    
    const neighbors = edges
      .filter(edge => edge.from === currentId)
      .map(edge => edge.to);
    
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId) && !queue.includes(neighborId)) {
        queue.push(neighborId);
        steps.push({
          type: 'highlight',
          nodeIds: [neighborId],
          description: `Adding node ${neighborId} to queue`
        });
      }
    }
  }
  
  return steps;
};

/**
 * Depth-first search algorithm
 * @param {import('../types/index.js').GraphNode[]} nodes 
 * @param {import('../types/index.js').GraphEdge[]} edges 
 * @param {string} startId 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const dfs = (nodes, edges, startId) => {
  const steps = [];
  const visited = new Set();
  
  const dfsHelper = (nodeId) => {
    visited.add(nodeId);
    steps.push({
      type: 'visit',
      nodeIds: [nodeId],
      description: `Visiting node ${nodeId}`
    });
    
    const neighbors = edges
      .filter(edge => edge.from === nodeId)
      .map(edge => edge.to);
    
    for (const neighborId of neighbors) {
      if (!visited.has(neighborId)) {
        steps.push({
          type: 'highlight',
          nodeIds: [neighborId],
          description: `Exploring node ${neighborId}`
        });
        dfsHelper(neighborId);
      }
    }
  };
  
  steps.push({
    type: 'visit',
    nodeIds: [startId],
    description: `Starting DFS from node ${startId}`
  });
  
  dfsHelper(startId);
  
  return steps;
};

/**
 * Dijkstra's shortest path algorithm
 * @param {import('../types/index.js').GraphNode[]} nodes 
 * @param {import('../types/index.js').GraphEdge[]} edges 
 * @param {string} startId 
 * @returns {import('../types/index.js').AlgorithmStep[]}
 */
export const dijkstra = (nodes, edges, startId) => {
  const steps = [];
  const distances = new Map();
  const previous = new Map();
  const unvisited = new Set();
  
  // Initialize distances
  for (const node of nodes) {
    distances.set(node.id, node.id === startId ? 0 : Infinity);
    unvisited.add(node.id);
  }
  
  steps.push({
    type: 'distance',
    nodeIds: [startId],
    description: `Starting Dijkstra from node ${startId} with distance 0`
  });
  
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentId = '';
    let minDistance = Infinity;
    
    for (const nodeId of unvisited) {
      const distance = distances.get(nodeId);
      if (distance < minDistance) {
        minDistance = distance;
        currentId = nodeId;
      }
    }
    
    if (minDistance === Infinity) break;
    
    unvisited.delete(currentId);
    steps.push({
      type: 'visit',
      nodeIds: [currentId],
      description: `Visiting node ${currentId} with distance ${minDistance}`
    });
    
    // Update distances to neighbors
    const neighbors = edges.filter(edge => edge.from === currentId);
    
    for (const edge of neighbors) {
      const neighborId = edge.to;
      if (unvisited.has(neighborId)) {
        const newDistance = distances.get(currentId) + edge.weight;
        const currentDistance = distances.get(neighborId);
        
        if (newDistance < currentDistance) {
          distances.set(neighborId, newDistance);
          previous.set(neighborId, currentId);
          steps.push({
            type: 'distance',
            nodeIds: [neighborId],
            description: `Updated distance to node ${neighborId}: ${newDistance}`
          });
        }
      }
    }
  }
  
  return steps;
};