import {
  View,
  type Pretty,
  type Typed,
  Children,
  DLightViewProp,
  Content,
  required,
  Env,
  Prop,
  Watch,
} from "@dlightjs/dlight"
import { RouteGroupEnv, RouteOption, RouteProps } from "./types"

@View
class Route implements RouteProps {
  @Env _dl_router_routesCollect: RouteGroupEnv["_dl_router_routesCollect"] =
    required
  @Content path: RouteProps["path"] = ".*" as RouteProps["path"]

  @Prop comp?: RouteProps["comp"]
  @Children children?: DLightViewProp
  @Prop loading?: RouteProps["loading"]
  @Prop redirect?: RouteProps["redirect"]
  @Prop info?: RouteOption["info"]

  @Watch
  collectRoutes() {
    this._dl_router_routesCollect!(this.path!, {
      comp: this.comp,
      children: this.children,
      loading: this.loading,
      redirect: this.redirect,
      info: this.info,
    })
  }
}

export default Route as Pretty as Typed<RouteProps>
