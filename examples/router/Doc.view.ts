import { View, type Pretty, type Typed, Prop, required, h2 } from "@dlightjs/dlight"

@View
class Doc {
  @Prop name: string = required

  willMount() {
    console.log(`Doc willMount: ${this.name}`)
  }
  willUnmount() {
    console.log(`Doc willUnmount: ${this.name}`)
  }
  
  View() {
    h2(`Doc name: ${this.name}`)
  }
}

export default Doc as Pretty as Typed
