import { CSSProperties, Children, DLightViewProp, Pretty, Prop, Typed, View, _, div, required } from "@dlightjs/dlight"
import { injectFuncToInitNodes } from "../Injection/utils"

interface ZStackProps {
  hAlignment?: "leading" | "center" | "tailing"
  vAlignment?: "top" | "center" | "bottom"
  width?: string
  height?: string
  style?: CSSProperties
  class?: string
}

@View
class ZStack implements ZStackProps {
  @Prop hAlignment: ZStackProps["hAlignment"] = "center"
  @Prop vAlignment: ZStackProps["vAlignment"] = "center"
  @Prop width = "max-content"
  @Prop height = "max-content"
  @Prop style?: ZStackProps["style"] = {}
  @Prop class?: ZStackProps["class"]
  @Children children: DLightViewProp[] = required

  justifyItems = {
    leading: "flex-start",
    center: "center",
    tailing: "flex-end"
  }[this.hAlignment!] ?? "center"

  alignItems = {
    top: "flex-start",
    center: "center",
    bottom: "flex-end"
  }[this.vAlignment!] ?? "center"

  nodes: any[] = []

  setStyles(nodes: any) {
    View.loopShallowEls(nodes, (el: HTMLElement) => {
      el.style.position = "absolute"
      el.style.gridArea = "1 / 1/ 1 / 1"
    })
  }

  didMount() {
    this.setStyles(this.nodes)
    injectFuncToInitNodes(this.nodes, this.setStyles)
  }

  Body() {
    div()
      .style({
        ...this.style,
        height: this.height,
        width: this.width,
        display: "grid",
        alignItems: this.alignItems,
        justifyItems: this.justifyItems,
      })
      .class(this.class)
    {
      _(this.children)
        .didMount((node: any) => {
          this.nodes = node._$nodes
        })
    }
  }
}

export default ZStack as Pretty as Typed<ZStack>