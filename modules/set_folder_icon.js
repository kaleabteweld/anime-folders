const path = require("path");
const { exec } = require("child_process");
const { rejects } = require("assert");

// for windows
async function set_icon(pic_file, anime_name, conter) {
  const name = path.basename(pic_file).split(".").slice(0, -1).join(".");
  var dir = pic_file.split(name)[0];
  //const temp = dir + name + ".ico";
  const temp = name + ".ico";
  dir = dir.slice(0, dir.length - 1);

  // get cur dir
  let pwd_ = process.argv[1];
  pwd = path.basename(pwd_).split(".").slice(0, -1).join(".");
  pwd = pwd_.split(pwd)[0];

  console.log(`${pwd}custom_folder_icon.bat "${dir}" "${temp}"`);
  return new Promise((resolve, reject) => {
    exec(
      `${pwd}custom_folder_icon.bat "${dir}" "${temp}"`,
      (error, stdout, stderr) => {
        if (error) {
          //console.log(`[-]error <exec>: ${error.message}`);
          reject(error);
        }
        if (stderr) {
        }
        if (stdout) {
          console.log("[+] done with desktop.ini for " + anime_name);
          resolve(conter);
        }
        //console.log(`stdout: ${stdout}`);
      }
    );
  });
}
module.exports = set_icon;
