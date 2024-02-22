import {
  Children,
  DLightViewProp,
  Env,
  Pretty,
  Prop,
  Typed,
  View,
  Watch,
  env,
  required,
} from "@dlightjs/dlight"
import { Navigator } from "./Navigator"
import { getHashLocation, getHistoryLocation, isDLightClass, paramObjCompare, trimPath } from "./utils"
import {
  RouteGroupEnv,
  RouteGroupProps,
  RouteInfo,
  RouteOption,
} from "./types"

const rawHistoryPushState = history.pushState
let historyPushStateFuncs: Array<() => any> = []

@View
class RouteGroup implements RouteGroupProps {
  @Env _dl_router_baseUrl = "/"

  @Prop mode: RouteGroupProps["mode"] = "history"
  @Prop loading?: RouteGroupProps["loading"]
  @Prop guard?: RouteGroupProps["guard"]
  @Prop onPathUpdate?: RouteGroupProps["onPathUpdate"]
  @Prop afterEnter?: RouteGroupProps["afterEnter"]
  @Prop beforeLeave?: RouteGroupProps["beforeLeave"]

  @Children routes: DLightViewProp[] = required

  @Watch
  updatePath() {
    if (this.onPathUpdate) this.onPathUpdate(this.prevInfo.path)
  }

  routeMap: Record<string, RouteOption> = {}

  hitPath: string = ""
  prevInfo: RouteInfo = { path: "/" }

  viewHolder: {
    view?: DLightViewProp | DLightViewProp | DLightViewProp
    propView: boolean
    params?: Record<string, string>
  } = {
    propView: true,
  }

  homeUrl(path: string) {
    // ---- Replace the leading "~/" with the base url
    return path.replace(/^~/, this._dl_router_baseUrl)
  }

  loaded = false
  collectRoutes(key: string, value: RouteOption) {
    this.routeMap[key] = value
    // ---- After the first render, setting the routeMap means change lazy or comp
    //      So we need to update the route and get the new view
    if (this.loaded) this.updateRoute(this.prevInfo.path)
  }

  async updateRoute(currUrl: string) {
    if (!this.loaded) this.loaded = true
    const fullCurrUrl = "/" + currUrl
    currUrl = trimPath(
      fullCurrUrl.replace(new RegExp(`^${this._dl_router_baseUrl}`), "")
    )

    for (const [
      targetUrl,
      { comp, children, loading, redirect, info },
    ] of Object.entries(this.routeMap)) {
      // ---- Remove the leading "./" from the targetUrl
      const newTargetUrl = this.homeUrl(targetUrl.replace(/^(\.\/)+/, ""))
      // ---- Check if the route is a root route
      const isRootRoute = newTargetUrl === "." && currUrl === ""

      // ---- Check if the current path is a parent path of the target path
      const isParentPath = currUrl.startsWith(newTargetUrl + "/")

      let pathMatch: RegExpMatchArray | null = null
      let params: Record<string, string> | undefined
      if (!isParentPath) {
        // ---- Using regex to check if the current path matches the target path
        pathMatch = currUrl.match(new RegExp(`^${newTargetUrl}$`))
        if (pathMatch) params = pathMatch.groups
      }

      const isMatch = isRootRoute || isParentPath || !!pathMatch
      if (!isMatch) continue

      // ---- Same order below, children > comp
      const viewToUpdate = children ?? comp
      if (targetUrl === this.hitPath && 
        viewToUpdate === this.viewHolder.view &&
        paramObjCompare(params, this.viewHolder.params)) {
        // ---- When condition is the same, ignore
        return
      }
      // ---- Check guard
      const currInfo = { ...info, path: fullCurrUrl }
      if (this.guard) {
        const canGo = await this.guard(
          currInfo,
          this.prevInfo,
          this._dl_router_baseUrl
        )
        if (canGo === false) {
          this.navigator.to(this.prevInfo.path)
          return
        }
        if (typeof canGo === "string") {
          this.navigator.to(this.homeUrl(canGo))
          return
        }
      }
      // ---- Check redirect
      if (redirect) {
        this.navigator.to(this.homeUrl(redirect))
        return
      }

      // ---- Life cycle
      this.beforeLeave && await this.beforeLeave(currInfo, this.prevInfo, this._dl_router_baseUrl)
      const afterEnter = async () => {
        this.afterEnter && await this.afterEnter(currInfo, this.prevInfo, this._dl_router_baseUrl)
      }
      if (children) {
        this.viewHolder = {
          view: children,
          propView: true,
        }
        afterEnter()
      } else if (comp) {
        if (isDLightClass(comp)) {
          // ---- It's a component class
          this.viewHolder = {
            view: comp,
            propView: false,
            params,
          }
          afterEnter()
        } else {
          // ---- It's a lazy loaded component
          const newLoading = loading ?? this.loading
          if (newLoading) {
            this.viewHolder = {
              view: newLoading,
              propView: !!(newLoading as any).propViewFunc,
            }
          }
          comp().then((module: any) => {
            this.viewHolder = {
              view: module.default,
              propView: false,
              params,
            }
            afterEnter()
          })
        }
      }

      this.hitPath = targetUrl
      this.prevInfo = { path: fullCurrUrl, ...params }
      return
    }
  }

  navigator = new Navigator()

  historyChangeListen() {
    const newUrl = getHistoryLocation()
    if (newUrl === this.prevInfo.path) return
    this.updateRoute(newUrl)
  }

  hashChangeListen() {
    const newUrl = getHashLocation()
    if (newUrl === this.prevInfo.path) return
    this.updateRoute(newUrl)
  }

  willMount() {
    this.navigator.mode = this.mode!
    Promise.resolve().then(() => {
      if (this.mode === "hash") {
        this.hashChangeListen()
      } else {
        this.historyChangeListen()
      }
    })
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
    env<RouteGroupEnv>()
      .navigator(this.navigator)
      .path(this.prevInfo.path)
      ._dl_router_baseUrl(
        "/" + trimPath(`${this._dl_router_baseUrl}/${this.hitPath}`)
      )
      ._dl_router_routesCollect(this.collectRoutes)
    {
      this.routes

      if (this.viewHolder.propView) {
        this.viewHolder.view
      } else {
        ;(this.viewHolder.view as any)().props(this.viewHolder.params)
      }
    }
  }
}

export default RouteGroup as Pretty as Typed<RouteGroupProps>
