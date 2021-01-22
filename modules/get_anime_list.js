const { readdirSync, statSync } = require("fs");
const { join } = require("path");

// get all folders
function dirs(p) {
  console.log("[+] geting your anime folders from " + p);

  let list = readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
  console.log("[+] found " + list.length + " animes folders");
  return list;
}
module.exports = dirs;
