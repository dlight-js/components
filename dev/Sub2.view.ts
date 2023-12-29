import { View } from "@dlightjs/dlight"
import { Env, div } from "@dlightjs/types"

function fabnacci(n) {
  if (n === 1 || n === 2) return 1
  return fabnacci(n - 1) + fabnacci(n - 2)
}
console.log(fabnacci(40))

@View
export default class Sub {
  @Env path
  @Env ok
  willMount() {
    console.log("path", this.path, this.ok)
  }
  View() {
    div("subaefaefa")
  }
}
