const { readdirSync, statSync } = require("fs");
const { join } = require("path");

// get all folders
function dirs(p) {
  console.log("[+] geting your anime folders from " + p);

  try {
    let list = readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());
    let len = Number(list.length) - 1;
    console.log("[+] found " + len + " animes folders");
    return list;
  } catch (error) {
    //console.log(error);
    if (error.code == "ENOENT") {
      console.log("[-] no such file or directory " + error.path);
    } else if (error.code == "ENOTDIR") {
      console.log("[-] " + error.path + " is not a directory");
    }
    return -1;
  }
}
module.exports = dirs;
