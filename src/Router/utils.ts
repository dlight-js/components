export function getHashLocation() {
  return location.hash.slice(2)
}

export function getHistoryLocation() {
  return location.pathname.slice(1)
}

export function getPath(url: string, mode: "history" | "hash") {
  let newHref: any
  if (url[0] === "/") {
    newHref = url
  } else {
    // ---- Relative path
    if (url[0] !== ".") url = "./" + url
    const baseUrl =
      mode === "history"
        ? window.location.pathname
        : window.location.hash.replace(/^#/, "")
    const splitUrls = url.split("/")
    const currUrls = baseUrl.split("/").filter(u => u)
    let idx = 0
    for (const splitUrl of splitUrls) {
      if (![".", ".."].includes(splitUrl)) break
      if (splitUrl === "..") {
        if (currUrls.length === 0) {
          console.warn(`no ../ in ${url}`)
        }
        currUrls.pop()
      }
      idx++
    }
    newHref = "/" + [...currUrls, ...splitUrls.slice(idx)].join("/")
  }
  return newHref
}

export function trimPath(path: string) {
  return path.replace(/(^\/+)|(\/+$)/g, "")
}

export function paramObjCompare(obj1: any, obj2: any) {
  if (!obj1 && !obj2) return true
  if (!obj1 || !obj2) return false
  if (Object.keys(obj1).length !== Object.keys(obj2).length) return false
  return Object.keys(obj1).every(key => obj2[key] === obj1[key])
}

export function isDLightClass(comp: any) {
  return !!comp.prototype?.View
}