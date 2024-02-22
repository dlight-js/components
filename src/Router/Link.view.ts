import {
  View,
  type Pretty,
  type Typed,
  ContentProp,
  Content,
  required,
  Prop,
  Env,
  a,
  DLightViewProp,
  Children,
} from "@dlightjs/dlight"
import { RouteEnv } from "./types"
import { Navigator } from "./Navigator"
import { getHashLocation, getHistoryLocation } from "./utils"

interface LinkProps {
  content?: ContentProp<string>
  to: string
  mode?: "hash" | "history"
  style?: Record<string, string>
  class?: string
}

@View
class Link implements LinkProps {
  @Content content: LinkProps["content"] = required
  @Prop to: LinkProps["to"] = required
  @Prop mode: LinkProps["mode"] = "history"
  @Prop style?: LinkProps["style"] = {}
  @Prop class?: LinkProps["class"] = ""

  @Children children?: DLightViewProp

  @Env navigator: RouteEnv["navigator"] = required

  nav = this.navigator ?? new Navigator(this.mode)

  handleClick(e: Event) {
    e.preventDefault()
    if (this.to.startsWith("http")) return window.open(this.to, "_blank")
    if (this.to.startsWith("?")) {
      // ---- return current path with query
      const currentPath =
        this.nav.mode === "history" ? getHistoryLocation() : getHashLocation()
      return this.nav.to(currentPath + this.to)
    }
    this.nav.to(this.to)
  }

  View() {
    a()
      .onClick(this.handleClick)
      .class(this.class)
      .style(this.style)
    {
      this.children ?? this.content
    }
  }
}

export default Link as Pretty as Typed<LinkProps>
