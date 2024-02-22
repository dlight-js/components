import {
  Pretty,
  Typed,
  View,
  Watch,
  button,
  div,
  env,
  h1,
  h2,
} from "@dlightjs/dlight"

import { RouteGroup, Navigator } from "../src"
import Sub from "./Sub.view"
import Sub3 from "./Sub3.view"
import Route from "../src/Router/Route.view"

@View
class App {
  navigator = new Navigator("history")
  jj = Sub
  // @Watch
  // watchView() {
  //   console.log("jjjj???", this.jj)
  // }

  @View
  Button = ({ content: path }: any) => {
    button(`To [ ${path} ]`).onClick(() => {
      this.navigator.to(path)
    })
  }

  View() {
    button("change").onClick(() => {
      this.jj = this.jj === Sub ? Sub3 : Sub
    })
    // env().ok(this.hh)
    // {
    // Routes({
    //   hello: View => {
    //     div("hello")
    //     RouteGroup({
    //       "sub1(?<year>.*)": () => import("./Sub2.view"),
    //       sub: this.jj,
    //       "sub(?<ok>.*)/not": this.jj,
    //       ".": View => {
    //         div("shit")
    //       },
    //       ".*": View => {
    //         div("nono")
    //       },
    //       // sub2: () => import("./Sub2.view"),
    //     }).fallback(View => {
    //       div(".....loading")
    //     })
    //   },
    //   world: View => {
    //     div("world")
    //   },
    // }).onPathUpdate(a => (this.hh = a))
    // }
    RouteGroup()
    {
      Route("hello")
      {
        div()
        {
          h2("shit")
          RouteGroup()
            .loading(View => {
              h1("shit Loading")
            })
            .guard((to, from, base) => {
              console.log([base])
              if (to.path === `${base}/sub`) {
                return "~/sub12021"
              }
            })

          {
            Route("sub1(?<year>.*)").lazy(() => import("./Sub2.view"))
            Route("sub").comp(this.jj)
            Route("sub(?<ok>.*)/not").comp(this.jj)
            Route("redirect").redirect("../sub")
            Route()
            {
              div("okk")
            }
          }
        }
      }
      Route("world")
      {
        div("world")
      }
    }
    this.Button("/hello/sub12")
    this.Button("/hello/subjj/not")
    this.Button("/hello/redirect")
    this.Button("/world")
  }
}

export default App as Pretty as Typed
