const open = require("open");
const pkceChallenge = require("pkce-challenge");
const http = require("http");
const axios = require("axios").default;
const qs = require("qs");
const fs = require("fs");
const ico = require("./temp");
const path = require("path");
const { exec } = require("child_process");

const { readdirSync, statSync } = require("fs");
const { join } = require("path");
const { url } = require("inspector");

const dirs = (p) =>
  readdirSync(p).filter((f) => statSync(join(p, f)).isDirectory());

async function download(uri, filename) {
  console.log("[+] downloading....[" + uri + "]");
  console.log("[+] and writeing to [" + filename + "]");

  const res = await axios({
    method: "GET",
    url: uri,
    responseType: "stream",
  });

  res.data.pipe(fs.createWriteStream(filename));
  return new Promise((resovle, reject) => {
    res.data.on("end", () => {
      resovle(0);
    });

    res.data.on("error", (err) => {
      reject(err);
    });
  });
}

function desktop_ini(pic_file) {
  const name = path.basename(pic_file).split(".").slice(0, -1).join(".");
  const dir = pic_file.split(name)[0];
  const temp = dir + name + ".ico";

  exec(`custom_folder_icon.bat "${dir}" "${temp}"`, (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`);
      //return;
    }
    if (stderr) {
      //console.log(`stderr: ${stderr}`);
      //return;
    }
    console.log(`stdout: ${stdout}`);
  });

  const data = `[.ShellClassInfo]
IconFile=${name}.ico
IconIndex=0
ConfirmFileOp=0
IconResource=${name}.ico,0
`;
  // exec(`attrib -h -r ${dir}\desktop.ini`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     //return;
  //   }
  //   if (stderr) {
  //     //console.log(`stderr: ${stderr}`);
  //     //return;
  //   }
  //   //console.log(`stdout: ${stdout}`);
  // });
  // fs.writeFileSync(`${dir}\desktop.ini`, data);
  // exec(`attrib +S +H ${dir}\desktop.ini`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     //return;
  //   }
  //   if (stderr) {
  //     //console.log(`stderr: ${stderr}`);
  //     //return;
  //   }
  //   //console.log(`stdout: ${stdout}`);
  // });
  // exec(`attrib +R ${dir}`, (error, stdout, stderr) => {
  //   if (error) {
  //     console.log(`error: ${error.message}`);
  //     //return;
  //   }
  //   if (stderr) {
  //     //console.log(`stderr: ${stderr}`);
  //     //return;
  //   }
  //   //console.log(`stdout: ${stdout}`);
  // });
  console.log("[+] done with desktop.ini for " + name);
}

function start(access_token, home_folder = process.argv[2]) {
  //console.log(dirs(home_folder));
  dirs(home_folder).forEach((element) => {
    console.log(element);
    axios
      .get(`https://api.myanimelist.net/v2/anime?q=${element}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        data = res.data.data[0].node;
        //console.log(data);
        if (data != undefined) {
          console.log("ok for " + element);

          const file =
            home_folder +
            "\\" +
            element +
            "\\" +
            data.main_picture.large.split("/")[
              data.main_picture.large.split("/").length - 1
            ];

          download(data.main_picture.large, file)
            .then(() => {
              console.log("[+] done downloding for " + element);
              ico(file);
              desktop_ini(file);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          console.log("can not find anime");
        }
      })
      .catch((error) => {
        console.log("error while finding " + element);
        console.log(error);
      });
  });
}

const code_verifier = pkceChallenge()["code_verifier"];
const code_challenge = pkceChallenge()["code_challenge"];
const client_id = "8e19f1bdd74b9844b0430147618e5175";
const client_secret =
  "18b3a196766b93821a1d0bb2de2633178015eea80096e858fb95f71b0f999286";
code = "";
access_token = "";
const grant_type = "authorization_code";
const state = "YOUR_STATE";
const response_type = "code";

// start sever
var server = http.createServer(function (req, res) {
  //console.log(req.url);
  if (req.url.split("?")[0] == "/anime") {
    //console.log("ok");

    try {
      // get access to URLSearchParams object
      // new URL object
      const current_url = new URL("http://" + req.headers.host + req.url);

      const search_params = current_url.searchParams;
      code = search_params.get("code");
      //console.log(code);
      //console.log(code_challenge);

      // get user's access token
      axios
        .post(
          " https://myanimelist.net/v1/oauth2/token",

          qs.stringify({
            client_id,
            client_secret,
            code,
            code_verifier: code_challenge,
            grant_type,
          }),
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            },
          }
        )
        .then(function (response) {
          // handle success
          console.log("access_token ok");
          //console.log(response.data);
          access_token = response.data.access_token;
          start(access_token);
        })
        .catch(function (error) {
          // handle error
          console.log(error);
          //console.log("error");
        });

      res.writeHead(200, { "Content-Type": "text/html" });
      res.write("<html><body><p>ok</p></body></html>");
      res.end();
    } catch (error) {
      console.log(error);
      res.writeHead(400, { "Content-Type": "text/html" });
      res.write("<html><body><p>error</p></body></html>");
      res.end();
    }
  }
});
server.listen(3000);
console.log("Node.js web server at port 3000 is running..");

//Opens the URL in the default browser.
const open_url = `https://myanimelist.net/v1/oauth2/authorize?response_type=${response_type}&client_id=${client_id}&code_challenge=${code_challenge}&state=${state}`;
// console.log(open_url);
open(open_url, { wait: true }).finally(() => {
  console.log("ok");
});
