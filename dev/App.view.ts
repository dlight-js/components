import {
  Pretty,
  Typed,
  View,
  button,
  div,
} from "@dlightjs/dlight"


import { VStack, Spacer } from "../src"

@View
class JJ {
  async willMount() {
    console.log("jj will mount")
  }

  Body() {
    "ok"
  }
}
@View
class App {
  arr = [1]

  Body() {
      JJ()
  
  }
}

export default App as Pretty as Typed
