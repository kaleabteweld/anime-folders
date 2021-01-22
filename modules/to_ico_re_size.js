const fs = require("fs");
const pngToIco = require("png-to-ico");
var resizePngBuffer = require("resize-png-buffer");
const Jimp = require("Jimp");
const path = require("path");

function ico(file = "") {
  const name = path.basename(file).split(".").slice(0, -1).join(".");
  const dir = file.split(name)[0];

  console.log("[*] making icon");

  return new Promise((resovle, reject) => {
    Jimp.read(file, function (err, image) {
      if (err) {
        console.log(err);
      } else {
        image.write(`${dir}\\.temp\\${name}.png`, () => {
          var resize = resizePngBuffer(
            fs.readFileSync(`${dir}\\.temp\\${name}.png`)
          );

          resize([200, 200], function (err, buffer) {
            if (err) reject(err);
            fs.writeFile(`${dir}\\.temp\\${name}-200x200.png`, buffer, () => {
              pngToIco(`${dir}\\.temp\\${name}-200x200.png`)
                .then((buf) => {
                  fs.writeFileSync(`${dir}\\${name}.ico`, buf);

                  resovle({ ok: 1, file });
                })
                .catch((err) => {
                  reject(err);
                });
            });
          });
        });
      }
    });
  });
}

module.exports = ico;
