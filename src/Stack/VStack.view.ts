import { CSSProperties, Children, DLightViewProp, Pretty, Prop, Typed, View, _, div, required } from "@dlightjs/dlight"
import { injectFuncToInitNodes } from "../Injection/utils"

interface VStackProps {
  spacing?: number
  alignment?: "leading" | "tailing" | "center"
  width?: string
  height?: string
  style?: CSSProperties
  class?: string
}

@View
class VStack implements VStackProps {
  @Prop spacing = 0
  @Prop alignment: VStackProps["alignment"] = "leading"
  @Prop width = "max-content"
  @Prop height = "100%"
  @Prop style?: VStackProps["style"] = {}
  @Prop class?: VStackProps["class"]
  @Children children: DLightViewProp[] = required

  margin = {
    leading: "0 auto 0 0",
    tailing: "0 0 0 auto",
    center: "0 auto",
  }[this.alignment!] ?? "0 auto 0 0"

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

  View() {
    div()
      .style({
        ...this.style,
        height: this.height,
        width: this.width,
        rowGap: `${this.spacing}px`,
        display: "flex",
        flexDirection: "column",
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

export default VStack as Pretty as Typed<VStackProps>