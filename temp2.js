const { exec } = require("child_process");
const path = require("path");

//const dir = "C:\\Users\\kalea\\Desktop\\temp\\5-toubun no Hanayome 2";

console.log(`${process.argv}`);
let pwd = process.argv[1];
const name = path.basename(pwd).split(".").slice(0, -1).join(".");
var dir = pwd.split(name)[0];
console.log(`${dir}custom_folder_icon.bat`);

exec(
  `custom_folder_icon.bat "F:\\Video\\anime\\SK∞" "F:\\Video\\anime\\SK∞\\108385l.ico"`,
  (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      //return;
    }
    if (stderr) {
      //console.log(`stderr: ${stderr}`);
      //return;
    }
    console.log(`stdout: ${stdout}`);
  }
);
