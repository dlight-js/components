import { View, type Pretty, type Typed, h1 } from "@dlightjs/dlight"

@View
class Home {
  Body() {
    h1("Home: component")
  }
}

export default Home as Pretty as Typed
