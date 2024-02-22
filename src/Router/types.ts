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
  comp?: DLightViewComp | DLightViewLazy
  children?: DLightViewProp
  loading?: DLightViewProp | DLightViewComp
  redirect?: string
  info?: Record<string, any>
}

export interface RouteGroupEnv {
  navigator?: Navigator
  path?: string
  _dl_router_baseUrl?: string
  _dl_router_routesCollect?: (path: string, option: RouteOption) => void
}

export interface RouteGroupProps {
  mode?: "hash" | "history"
  onPathUpdate?: (path: string) => void
  loading?: (View: any) => void
  guard?: LifecycleFunc
  afterEnter?: LifecycleFunc
  beforeLeave?: LifecycleFunc
}

export type RouteEnv = Omit<
  RouteGroupEnv,
  "_dl_router_routesCollect" | "_dl_router_baseUrl"
>

export type RouteProps = {
  path?: ContentProp<string>
} & Omit<RouteOption, "children">
