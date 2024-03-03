import { View, type Pretty, type Typed, ContentProp, Content, required, button, div } from "@dlightjs/dlight"
import { Link } from "../../src";

interface LinksProps {
  links: ContentProp<string[]>
}

@View
class Links implements LinksProps {
  @Content links: LinksProps["links"] = required

  @View
  Link = ({content: path}: any) => {
    Link().to(path); {
      button(path)
    }
  }

  Body() {
    div(); {
      for (const link of this.links) {
        this.Link(link)
      }
    }
  }
}

export default Links as Pretty as Typed<LinksProps>
