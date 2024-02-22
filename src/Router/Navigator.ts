import { getPath } from "./utils"

export class Navigator {
  mode: "hash" | "history"

  constructor(mode: "hash" | "history" = "history") {
    this.mode = mode
  }

  hashTo(url: string) {
    window.location.href = "#" + getPath(url, this.mode)
  }

  historyTo(url: string) {
    window.history.pushState({}, "", getPath(url, this.mode))
  }

  to(url: string) {
    if (this.mode === "hash") {
      this.hashTo(url)
      return
    }
    this.historyTo(url)
  }
}
