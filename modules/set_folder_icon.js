const path = require("path");
const { exec } = require("child_process");

// for windows
function set_icon(pic_file, anime_name, conter) {
  const name = path.basename(pic_file).split(".").slice(0, -1).join(".");
  var dir = pic_file.split(name)[0];
  const temp = dir + name + ".ico";
  dir = dir.slice(0, dir.length - 1);

  // get cur dir
  let pwd_ = process.argv[1];
  pwd = path.basename(pwd_).split(".").slice(0, -1).join(".");
  pwd = pwd_.split(pwd)[0];

  exec(
    `${pwd}custom_folder_icon.bat "${dir}" "${temp}"`,
    (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
      }
      if (stderr) {
      }
      //console.log(`stdout: ${stdout}`);
    }
  );
  console.log("[+] done with desktop.ini for " + anime_name);
  return conter;
}
module.exports = set_icon;
