import {
  ContentProp,
  DLightViewComp,
  DLightViewLazy,
  DLightViewProp,
} from "@dlightjs/dlight"
import { Navigator } from "./Navigator"


export type LifecycleFunc = (
  to: RouteInfo,
  from: RouteInfo,
  baseUrl: string
) => (boolean | void | string) | Promise<boolean | void | string>

export type RouteInfo = {
  path: string
  [key: string]: any
}

export interface RouteOption {
  /**
   * @brief The component of the route, could be a dlight component class or a lazy component
   */
  comp?: DLightViewComp | DLightViewLazy
  /**
   * @brief The children of the route, either comp or children should be provided
   */
  children?: DLightViewProp
  /**
   * @brief The loading component(applied only when the route is a lazy component)
   */
  loading?: DLightViewProp | DLightViewComp
  /**
   * @brief The redirect path
   */
  redirect?: string
  /**
   * @brief The info of the route, will be passed to the lifecycle functions
   */
  info?: Record<string, any>
}

export interface RouteGroupEnv {
  navigator?: Navigator
  path?: string
  _dl_router_baseUrl?: string
  _dl_router_routesCollect?: (path: string, option: RouteOption) => void
}

export interface RouteGroupProps {
  /**
   * @brief The mode of the router, "hash" or "history"
   * @default "history"
   */
  mode?: "hash" | "history"
  /**
   * @brief The callback function when the path is updated
   */
  onPathUpdate?: (path: string) => void
  /**
   * @brief The loading component(applied only when the route is a lazy component)
   */
  loading?: (View: any) => void
  /**
   * @brief The guard function to check the route
   */
  guard?: LifecycleFunc
  /**
   * @brief The callback function after entering the route
   */
  afterEnter?: LifecycleFunc
  /**
   * @brief The callback function before leaving the route
   */
  beforeLeave?: LifecycleFunc
}

export type RouteEnv = Omit<
  RouteGroupEnv,
  "_dl_router_routesCollect" | "_dl_router_baseUrl"
>

export type RouteProps = {
  path?: ContentProp<string>
} & Omit<RouteOption, "children">
