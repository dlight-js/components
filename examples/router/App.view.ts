import {
  Main,
  View,
  div,
  h1,
  h2,
} from "@dlightjs/dlight"

import { RouteGroup, Route } from "../../src"
import DocView from "./Doc.view";
import AboutView from "./About.view";
import Links from "./Links.view";

@View
@Main
class App {
  View() {
    Links([
      "/home", 
      "/about", 
      "/docs/normal-doc", 
      "/docs/another-good-doc", 
      "/docs/bad-doc", 
      "/docs/confidential-doc-2",
      "/docs/redirect-doc"
    ])

    RouteGroup(); {
      // ---- Lazy loaded route
      Route("home")
        .comp(() => import("./Home.view"))
        .loading(View => {
          div("Loading...")
        })

      // ---- Component route
      Route("about")
        .comp(AboutView)

      Route("docs"); {
        h1("Docs")
        div().class("doc-wrapper"); {
          // ---- Nested RouteGroup ----
          RouteGroup()
            .guard((to, from, baseUrl) => {
              // ---- Checking path, redirecting to good-doc
              if (to.path === `${baseUrl}/bad-doc`) return "~/not-found"
              // ---- Checking info, if confidential, block access
              if (to.confidential) return false
            })
            .afterEnter((to, from) => {
              // ---- Before route enter
              console.log(`Entering ${to.path} from ${from.path}...`)
            })
            .beforeLeave((to, from) => {
              // ---- Before route leave
              console.log(`Leaving ${from.path} to ${to.path}...`)
            })
            .loading(View => {
              // ---- Same as Route().loading(), 
              //      but applied for all path in this RouteGroup
              div("doc loading")
            })
          {
            // ---- Children Route
            Route("not-found"); {
              h2("404 - Not Found")
            }

            // ---- Redirect route, will be redirected to good-doc, 
            //      ~ means base path, which is /docs
            Route("redirect-doc")
              .redirect("~/good-doc")

            // ---- Confidential route, fully regex supported
            Route("confidential.+?")
              .info({
                confidential: true
              })

            // ---- Using regex named group to get the name of the doc from the path
            //      and treat it as a prop passed to DocView
            Route("(?<name>.*)")
              .comp(DocView)

            // ---- Any other route will be redirected to here,
            //      same with Route(".*")
            Route(); {
              h2("You're not supposed to be here")
            }
          }
        }
      }
    }
  }
}

export default App