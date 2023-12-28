import { View } from "@dlightjs/dlight"
import { Navigator } from "./Navigator"
import { getHashLocation, getHistoryLocation } from "./utils"
import {
  type Typed,
  type Pretty,
  Prop,
  Watch,
  env,
  Content,
  ContentProp,
  required,
  Env,
} from "@dlightjs/types"

const rawHistoryPushState = history.pushState
let historyPushStateFuncs: Array<() => any> = []

export interface RoutesEnv {
  navigator?: Navigator
  path?: string
  _$baseUrl?: string
}

interface RoutesProps {
  routeMap: ContentProp<
    Record<string, ((View: any) => void) | (<T>() => Promise<T>)>
  >
  mode?: "hash" | "history"
  getNavigator?: (nav: Navigator) => void
}

@View
class Routes implements RoutesProps {
  @Content routeMap: RoutesProps["routeMap"] = required
  @Prop mode: RoutesProps["mode"] = "history"
  @Prop getNavigator?: RoutesProps["getNavigator"]
  @Env _$baseUrl = ""

  currUrl = this.mode === "hash" ? getHashLocation() : getHistoryLocation()

  prevPathCondition?: string
  currentRoute: {
    view: any
    type: "view" | "lazy"
  } = {
    view: null,
    type: "view",
  }
  navigator = new Navigator()

  isRoutes = true

  static regPathTest = /^\/\/(.+?)\/\/$/

  @Watch
  updateRoute() {
    const currUrl = this.currUrl.replace(new RegExp(`^${this._$baseUrl}`), "")
    for (const [targetUrl, child] of Object.entries(this.routeMap)) {
      let isMatch = false
      if (Routes.regPathTest.test(targetUrl)) {
        // ---- If the path is a RegExp
        const reg = new RegExp(targetUrl.replace(Routes.regPathTest, "$1"))
        isMatch = reg.test(currUrl)
      } else {
        const newTargetUrl = targetUrl.replace(/^(\.\/)+/, "")
        const isRootRoute = newTargetUrl === "." && currUrl === ""
        const isPathMatch = (currUrl + "/").startsWith(newTargetUrl + "/")
        const isOther = newTargetUrl === "*"
        isMatch = isRootRoute || isPathMatch || isOther
      }

      if (!isMatch) continue
      if (targetUrl === this.prevPathCondition) {
        // ---- When condition is the same, return
        return
      }
      this.prevPathCondition = targetUrl

      if ("propViewFunc" in (child as any)) {
        this.currentRoute = {
          view: child,
          type: "view",
        }
      } else {
        ;(child as any)().then((module: any) => {
          this.currentRoute = {
            view: module.default,
            type: "lazy",
          }
        })
      }
      return
    }
  }

  historyChangeListen() {
    this.currUrl = getHistoryLocation()
  }

  hashChangeListen() {
    this.currUrl = getHashLocation()
  }

  willMount() {
    this.navigator.mode = this.mode!
    this.getNavigator?.(this.navigator)
  }

  didMount() {
    if (this.mode === "hash") {
      addEventListener("load", this.hashChangeListen)
      addEventListener("hashchange", this.hashChangeListen)
      return
    }
    addEventListener("load", this.historyChangeListen)
    addEventListener("popstate", this.historyChangeListen)

    // ---- Listen to pushState
    historyPushStateFuncs.push(this.historyChangeListen)
    history.pushState = new Proxy(rawHistoryPushState, {
      apply(target, thisArg, argArray) {
        const res = target.apply(thisArg, argArray as any)
        historyPushStateFuncs.forEach(func => func())
        return res
      },
    })
  }

  willUnmount() {
    if (this.mode === "hash") {
      removeEventListener("load", this.hashChangeListen)
      removeEventListener("hashchange", this.hashChangeListen)
      return
    }
    removeEventListener("load", this.historyChangeListen)
    removeEventListener("popstate", this.historyChangeListen)
    // ---- Delete current historyChangeListen
    historyPushStateFuncs = historyPushStateFuncs.filter(
      func => func !== this.historyChangeListen
    )
    if (historyPushStateFuncs.length > 0) {
      history.pushState = new Proxy(rawHistoryPushState, {
        apply(target, thisArg, argArray) {
          const res = target.apply(thisArg, argArray as any)
          historyPushStateFuncs.forEach(func => func())
          return res
        },
      })
    } else {
      history.pushState = rawHistoryPushState
    }
  }

  View() {
    env<RoutesEnv>()
      .navigator(this.navigator)
      .path(this.currUrl)
      ._$baseUrl(`${this._$baseUrl}${this.prevPathCondition}/`)
    {
      if (this.currentRoute.type === "view") {
        this.currentRoute.view
      } else {
        this.currentRoute.view()
      }
    }
  }
}

export default Routes as Pretty as Typed<RoutesProps>
