import { Children, DLightViewProp, Pretty, Prop, Typed, View, _, div, required, CSSProperties } from "@dlightjs/dlight"
import { injectFuncToInitNodes } from "../Injection/utils"

interface HStackProps {
  spacing?: number
  alignment?: "top" | "bottom" | "center"
  width?: string
  height?: string
  style?: CSSProperties
  class?: string
}

@View
class HStack implements HStackProps {
  @Prop spacing = 0
  @Prop alignment: HStackProps["alignment"] = "top"
  @Prop width = "100%"
  @Prop height = "max-content"
  @Prop style?: HStackProps["style"] = {}
  @Prop class?: HStackProps["class"]
  @Children children: DLightViewProp[] = required

  margin = {
    top: "0 0 auto 0",
    bottom: "auto 0 0 0",
    center: "auto 0",
  }[this.alignment!] ?? "0 0 auto 0"

  nodes: any[] = []

  setStyles(nodes: any) {
    View.loopShallowEls(nodes, (el: HTMLElement) => {
      el.style.flexShrink = "0"
      el.style.margin = this.margin
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
        columnGap: `${this.spacing}px`,
        display: "flex",
        flexDirection: "row",
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

export default HStack as Pretty as Typed<HStackProps>