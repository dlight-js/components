import {  Pretty, Typed, View, div } from "@dlightjs/dlight"

@View
class Spacer {
  isSpacer = true
  Body() {
    div()
      .style({
        flexGrow: 1,
      })
  }
}

export default Spacer as Pretty as Typed