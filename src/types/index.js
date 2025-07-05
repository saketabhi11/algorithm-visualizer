// Data structure interfaces converted to JSDoc comments for documentation

/**
 * @typedef {Object} ArrayElement
 * @property {number} value
 * @property {string} id
 * @property {boolean} [isComparing]
 * @property {boolean} [isSwapping]
 * @property {boolean} [isSorted]
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} ListNode
 * @property {number} value
 * @property {string} id
 * @property {string} [next]
 * @property {boolean} [isActive]
 * @property {boolean} [isHighlighted]
 */

/**
 * @typedef {Object} TreeNode
 * @property {number} value
 * @property {string} id
 * @property {string} [left]
 * @property {string} [right]
 * @property {number} [x]
 * @property {number} [y]
 * @property {boolean} [isActive]
 * @property {boolean} [isVisited]
 * @property {number} [level]
 */

/**
 * @typedef {Object} GraphNode
 * @property {string} id
 * @property {string} value
 * @property {number} x
 * @property {number} y
 * @property {boolean} [isActive]
 * @property {boolean} [isVisited]
 * @property {number} [distance]
 * @property {string} [previous]
 */

/**
 * @typedef {Object} GraphEdge
 * @property {string} from
 * @property {string} to
 * @property {number} weight
 * @property {boolean} [isActive]
 */

/**
 * @typedef {Object} AlgorithmStep
 * @property {'compare'|'swap'|'visit'|'highlight'|'sort'|'distance'} type
 * @property {number[]} [indices]
 * @property {string[]} [nodeIds]
 * @property {string} description
 */

/**
 * @typedef {'slow'|'medium'|'fast'} VisualizationSpeed
 */

export {};