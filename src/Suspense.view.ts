import { View } from "@dlightjs/dlight"
import { Children, Prop, type Pretty, type Typed } from "@dlightjs/types"

@View
class Suspense {
  @Prop fallback
  @Children children

  loaded = false

  View() {
    if (this.loaded) {
      this.children
        .didMount(() => this.loaded = true)
    }
  }
}

export default  as Pretty as Typed


