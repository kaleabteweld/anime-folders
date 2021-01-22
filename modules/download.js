const axios = require("axios").default;
const fs = require("fs");

async function download(uri, home_folder, anime_name) {
  const file =
    home_folder +
    "\\" +
    anime_name +
    "\\" +
    uri.split("/")[uri.split("/").length - 1];

  console.log(
    `[*] downloading "${anime_name}" poster and saveing to [ ${file} ]`
  );

  const res = await axios({
    method: "GET",
    url: uri,
    responseType: "stream",
  });

  res.data.pipe(fs.createWriteStream(file));
  return new Promise((resovle, reject) => {
    res.data.on("end", () => {
      resovle({ ok: 1, file });
    });

    res.data.on("error", (err) => {
      reject(err);
    });
  });
}
module.exports = download;
