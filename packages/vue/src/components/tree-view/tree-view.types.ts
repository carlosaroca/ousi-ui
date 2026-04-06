export interface TreeNode {
  key: string
  label: string
  icon?: string
  children?: TreeNode[]
  disabled?: boolean
}

export interface TreeViewProps {
  nodes: TreeNode[]
  defaultExpanded?: string[]
  selectable?: boolean
  selectedKey?: string
  class?: string
}

export interface TreeViewEmits {
  'select': [key: string, node: TreeNode]
  'expand': [key: string]
  'collapse': [key: string]
}
