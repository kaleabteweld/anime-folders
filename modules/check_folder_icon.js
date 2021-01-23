const fs = require("fs");

function check(path) {
  const fs = require("fs");

  const files = fs.readdirSync(path);

  for (const file of files) {
    //const stat = fs.lstatSync(path.join(path, file))
    if (file == "desktop.ini") {
      return true;
    }
  }
  return false;
}
module.exports = check;
