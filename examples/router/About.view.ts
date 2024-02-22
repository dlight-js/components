import { View, type Pretty, type Typed, h1 } from "@dlightjs/dlight"

@View
class About {
  View() {
    h1("About: component")
  }
}

export default About as Pretty as Typed
