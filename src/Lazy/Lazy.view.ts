import { View } from "@dlightjs/dlight"
import { type Pretty, ForwardProps } from "@dlightjs/types"

/**
 * @example
 * ```js
 * import { lazy } from "@dlightjs/components"
 * const MyComp = lazy(() => import("./MyComp.view"))
 * ```
 */
export function lazy<T>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: any
) {
  @ForwardProps
  @View
  class LazyComp {
    v?: any

    willMount() {
      void importFunc().then((module: any) => {
        this.v = module.default
      })
    }

    View() {
      if (this.v) {
        this.v().forwardProps()
      } else if (fallback) {
        fallback()
      }
    }
  }

  return LazyComp as Pretty as T
}
