/** Combines several refs (callback or object) into a single callback ref. */
export function mergeRefs(...refs) {
  return (node) => {
    for (const ref of refs) {
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }
  }
}
