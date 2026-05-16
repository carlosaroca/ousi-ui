export type TreeSelectionMode = 'none' | 'single' | 'multiple'

export interface TreeNode {
  key: string
  label: string
  /** SVG path data ('d' attribute) or a custom string the #icon slot may interpret. */
  icon?: string
  children?: TreeNode[]
  /** Signal that children are loaded async. The tree shows a chevron, and on
   *  expand it calls the `loadChildren` prop. Children are cached after load. */
  isAsync?: boolean
  disabled?: boolean
}

export interface TreeViewProps {
  /** Root nodes of the tree. */
  nodes: TreeNode[]
  /** Selection mode. Default: 'none'. */
  selectionMode?: TreeSelectionMode

  /** Controlled selected key (single-select shorthand). */
  selectedKey?: string
  /** Default selected key (uncontrolled, single-select). */
  defaultSelectedKey?: string

  /** Controlled set of selected keys (multi-select). */
  selectedKeys?: Set<string>
  /** Default selected keys (uncontrolled, multi-select). */
  defaultSelectedKeys?: Set<string>

  /** Controlled set of expanded keys. */
  expandedKeys?: Set<string>
  /** Default expanded keys (uncontrolled). */
  defaultExpandedKeys?: Set<string>

  /** Also toggle expansion when the user clicks the label (not just the chevron). Default: false. */
  expandOnLabelClick?: boolean

  /** Async loader for children. Called the first time a node with `isAsync: true`
   *  is expanded. Returned children are cached until `reload(key)` is called.
   *  Throw / reject to mark the node as failed — the user can retry by clicking. */
  loadChildren?: (node: TreeNode) => Promise<TreeNode[]>

  /** Additional CSS classes. */
  class?: string
}

export interface TreeViewEmits {
  /** Selection changed (single-select). */
  'select': [key: string, node: TreeNode]
  /** Node expanded. */
  'expand': [key: string]
  /** Node collapsed. */
  'collapse': [key: string]
  /** v-model:selectedKey (single-select). */
  'update:selectedKey': [key: string]
  /** v-model:selectedKeys (multi-select). */
  'update:selectedKeys': [keys: Set<string>]
  /** v-model:expandedKeys. */
  'update:expandedKeys': [keys: Set<string>]
}
