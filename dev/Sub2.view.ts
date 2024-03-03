import { Env, View, div } from "@dlightjs/dlight"

function fabnacci(n) {
  if (n === 1 || n === 2) return 1
  return fabnacci(n - 1) + fabnacci(n - 2)
}
console.log(fabnacci(42))

@View
export default class Sub2 {
  @Env path
  @Env ok
  willMount() {
    console.log("path", this.path, this.ok)
  }
  Body() {
    h1("subaefaefa")
  }
}
