const { readdirSync, statSync } = require("fs");
const { join } = require("path");

// get all folders
function dirs(p) {
  console.log("[+] geting your anime folders from " + p);

  let list = readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
  let len = Number(list.length) - 1;
  console.log("[+] found " + len + " animes folders");
  return list;
}
module.exports = dirs;
