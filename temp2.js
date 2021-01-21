const { exec } = require("child_process");

const dir = "C:\\Users\\kalea\\Desktop\\temp\\5-toubun no Hanayome 2";

exec(
  `custom_folder_icon.bat "${dir}" "C:\\Users\\kalea\\Desktop\\temp\\5-toubun no Hanayome 2\\109514l.ico"`,
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
