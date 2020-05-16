import { TreeNode } from 'primeng/api/treenode';

export interface TreeEvent {
  originalEvent: MouseEvent;
  node: TreeNode;
}
