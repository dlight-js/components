export function loopNodes(nodes: any[], runFunc: (node: any) => void){
  const stack = [...nodes].reverse()
  while (stack.length > 0) {
    const node = stack.pop()
    runFunc(node)
    if (!("_$dlNodeType" in node)) {
      if (node._$nodes) {
        stack.push(...[...node._$nodes].reverse())
      } else {
        stack.push(...[...node.childNodes].reverse())
      }
    } else node._$nodes && stack.push(...[...node._$nodes].reverse())
  }
}

export function injectFuncToInitNodes(nodes: any[], func: (node: any) => void) {
  const inject = (nodes: any[]) => {
    loopNodes(nodes, node => {
      if (node.initNewNodes) {
        const baseInitNewNodes = node.initNewNodes
        node.initNewNodes = function (newNodes: any) {
          baseInitNewNodes.call(this, newNodes)
          func(newNodes)
          inject(newNodes)
        }
      }
    })
  }

  inject(nodes)
}