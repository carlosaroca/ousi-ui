import type { SunburstNode } from './sunburst.types'

export interface TreeNode {
  key: string
  name: string
  value: number
  color?: string
  /** Which of its siblings it is. */
  order: number
  parent: TreeNode | null
  children: TreeNode[]
}

/**
 * The tree with every value worked out: a node with children is worth what they add up to. What is
 * worth nothing is left out. Keys are positions in the data as given.
 */
export function buildTree(data: SunburstNode[]): TreeNode[] {
  const build = (nodes: SunburstNode[], parent: TreeNode | null): TreeNode[] =>
    nodes.flatMap((node, order) => {
      const key = parent ? `${parent.key}.${order}` : String(order)
      const built: TreeNode = { key, name: node.name, value: 0, color: node.color, order, parent, children: [] }
      if (node.children?.length) {
        built.children = build(node.children, built)
        built.value = built.children.reduce((total, child) => total + child.value, 0)
      } else {
        built.value = Number.isFinite(node.value) ? Math.max(node.value!, 0) : 0
      }
      return built.value > 0 ? [built] : []
    })
  return build(data, null)
}

export function findNode(nodes: TreeNode[], key: string): TreeNode | null {
  for (const node of nodes) {
    if (node.key === key) return node
    if (key.startsWith(`${node.key}.`)) return findNode(node.children, key)
  }
  return null
}

export interface Placed {
  node: TreeNode
  /** 1 for the ring next to the centre. */
  depth: number
  from: number
  to: number
}

/** The angles of what is in view: each node takes of its parent's what its value is of the total. */
export function placeNodes(nodes: TreeNode[], levels: number, start = -90): Placed[] {
  const placed: Placed[] = []
  const walk = (list: TreeNode[], depth: number, from: number, span: number) => {
    if (depth > levels) return
    const total = list.reduce((sum, node) => sum + node.value, 0)
    let cursor = from
    for (const node of list) {
      const own = (node.value / total) * span
      placed.push({ node, depth, from: cursor, to: cursor + own })
      walk(node.children, depth + 1, cursor, own)
      cursor += own
    }
  }
  walk(nodes, 1, start, 360)
  return placed
}
