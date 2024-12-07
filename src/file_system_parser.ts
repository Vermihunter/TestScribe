export interface TreeNode {
    [name: string]: TreeNode;
}
  
  /**
   * Inserts a path (like "/usr/local/bin") into the given tree object.
   */
function insertPathIntoTree(root: TreeNode, path: string) {
    // Remove leading/trailing slashes and split the path into segments
    const segments = path.replace(/^\/+/, '').replace(/\/+$/, '').split('/');
    
    // If the path was just "/", segments would be [""], so handle that case
    // by ignoring empty top-level entries.
    const filteredSegments = segments.filter(seg => seg.length > 0);
    
    let current = root;
    for (const segment of filteredSegments) {
        if (!current[segment]) {
            current[segment] = {};
        }
        current = current[segment];
    }
}
  
  /**
   * Takes a set of paths and returns a tree structure.
   */
export function buildTreeFromPaths(paths: Set<string>): TreeNode {
    const root: TreeNode = {};
    for (const path of paths) {
        insertPathIntoTree(root, path);
    }
  
    return root;
}
  
// Example usage
// const paths = new Set([
//     "/usr/local/bin",
//     "/usr/local/share",
//     "/usr/local/lib",
//     "/etc/nginx/nginx.conf",
//     "/home/user/docs/readme.md"
// ]);
  
// const tree = buildTreeFromPaths(paths);
// console.log(JSON.stringify(tree, null, 2));
  