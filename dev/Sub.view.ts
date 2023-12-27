import { View } from "@dlightjs/dlight"
import { Env, div } from "@dlightjs/types"

@View
export default class Sub {
  @Env path
  @Env ok
  willMount() {
    console.log("path", this.path, this.ok)
  }
  View() {
    div("sub1")
  }
}
