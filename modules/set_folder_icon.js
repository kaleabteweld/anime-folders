const path = require("path");
const { exec } = require("child_process");

// for windows
function set_icon(pic_file, anime_name) {
  const name = path.basename(pic_file).split(".").slice(0, -1).join(".");
  var dir = pic_file.split(name)[0];
  const temp = dir + name + ".ico";
  dir = dir.slice(0, dir.length - 1);

  exec(`custom_folder_icon.bat "${dir}" "${temp}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
    }
    if (stderr) {
    }
    console.log(`stdout: ${stdout}`);
  });
  console.log("[+] done with desktop.ini for " + anime_name);
  return;
}
module.exports = set_icon;
