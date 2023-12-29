import { View } from "@dlightjs/dlight"
import { Env, Watch, div } from "@dlightjs/types"

@View
export default class Sub {
  @Env path
  @Env ok

  View() {
    div("sub1")
  }
}
