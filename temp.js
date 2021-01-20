const fs = require("fs");
const pngToIco = require("png-to-ico");
var resizePngBuffer = require("resize-png-buffer");
const Jimp = require("Jimp");
const path = require("path");

function temp(file = "") {
  // var file =
  // "C:\\Users\\kalea\\Desktop\\temp\\Attack on Titan Final Season\\110531l.jpg";
  const name = path.basename(file).split(".").slice(0, -1).join(".");
  const dir = file.split(name)[0];

  function go() {
    console.log("[+] done makeing icon for " + name);
    pngToIco(`${dir}\\${name}-200x200.png`)
      .then((buf) => {
        fs.writeFileSync(`${dir}\\${name}.ico`, buf);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  Jimp.read(file, function (err, image) {
    if (err) {
      console.log(err);
    } else {
      image.write(`${dir}\\${name}.png`, () => {
        var resize = resizePngBuffer(fs.readFileSync(`${dir}\\${name}.png`));

        resize([200, 200], function (err, buffer) {
          if (err) return next(err);
          fs.writeFile(`${dir}\\${name}-200x200.png`, buffer, go);
        });
      });
    }
  });
}

// temp("C:\\Users\\kalea\\Desktop\\temp\\Dr. Stone- Stone Wars\\110614l.jpg");
module.exports = temp;
