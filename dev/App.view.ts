import { View } from "@dlightjs/dlight"
import {
  type Typed,
  type Pretty,
  div,
  button,
  Content,
  Watch,
} from "@dlightjs/types"
import { Routes, Navigator } from "../src"

@View
class App {
  navigator = new Navigator("history")
  hh

  @Watch
  watchPath() {
    console.log("jjjji", this.hh)
  }

  View() {
    env().ok(this.hh)
    {
      Routes({
        hello: View => {
          div("hello")
          Routes({
            sub1: () => import("./Sub.view"),
            sub2: () => import("./Sub2.view"),
          }).fallback(View => {
            div(".....loading")
          })
        },
        world: View => {
          div("world")
        },
      }).onPathUpdate(a => (this.hh = a))
    }
    button("to hello/sub1").onClick(() => {
      this.navigator.to("/hello/sub1")
    })
    button("to hello/sub2").onClick(() => {
      this.navigator.to("/hello/sub2")
    })
    button("to world").onClick(() => {
      this.navigator.to("/world")
    })
  }
}

export default App as Pretty as Typed
