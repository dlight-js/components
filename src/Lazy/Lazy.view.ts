import { ForwardProps, Pretty, View } from "@dlightjs/dlight"

/**
 * @example
 * ```js
 * import { lazy } from "@dlightjs/components"
 * const MyComp = lazy(() => import("./MyComp.view"))
 *
 * import Loading from "./Loading.view"
 * const MyComp = lazy(() => import("./MyComp.view"), Loading)
 * ```
 */
export function lazy<T>(
  importFunc: () => Promise<{ default: T }>,
  FallbackCls?: any
) {
  @ForwardProps
  @View
  class LazyComp {
    ViewCls?: any

    willMount() {
      void importFunc().then((module: any) => {
        this.ViewCls = module.default
      })
    }

    Body() {
      if (this.ViewCls) {
        this.ViewCls().forwardProps()
      } else if (FallbackCls) {
        FallbackCls()
      }
    }
  }

  return LazyComp as Pretty as T
}
