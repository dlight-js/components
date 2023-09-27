import { execSync } from "child_process"
import { writeFileSync, readFileSync } from "fs"
const tag = `temp-${Math.random().toString(32).slice(2, 8)}`

execSync(`./node_modules/.bin/babel --extensions .ts src --out-dir ${tag}  --out-file-extension .ts`, { stdio: "inherit" })

const filename = "tsup.config.ts"
const tsupconfig = readFileSync(filename, "utf-8")
writeFileSync(filename, tsupconfig.replace(/src/g, tag).replace("dts: true,", ""), "utf-8")

try {
  execSync("tsup --sourcemap", { stdio: "inherit" })
} catch {}

writeFileSync(filename, tsupconfig, "utf-8")

try {
  execSync("tsup --dts-only --sourcemap", { stdio: "inherit" })
} catch {}

execSync(`rm -rf ${tag}`, { stdio: "inherit" })
