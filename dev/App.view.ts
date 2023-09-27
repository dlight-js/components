import { View } from "@dlightjs/dlight"
import { type Typed, type Pretty, div } from "@dlightjs/types"
import { HStack } from "../src"

interface AppProps {
}

@View
class App implements AppProps {
  Body() {
    HStack()
    {
      div("hhhh")
      div("jj")
    }
  }
}

export default App as Pretty as Typed<AppProps>
