import { View } from "@dlightjs/dlight"
import { type Typed, type Pretty, div, button, Content } from "@dlightjs/types"
import { Routes } from "../src"

@View
class App {
  navigator
  View() {
    env().ok("shit")
    {
      Routes({
        hello: View => {
          div("hello")
          Routes({
            sub1: () => import("./Sub.view"),
            sub2: View => {
              div("sub2")
            },
          })
        },
        world: View => {
          div("world")
        },
      }).getNavigator(n => {
        this.navigator = n
      })

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
}

export default App as Pretty as Typed
