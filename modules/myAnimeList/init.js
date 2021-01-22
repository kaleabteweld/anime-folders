const pkceChallenge = require("pkce-challenge");
const http = require("http");
const axios = require("axios").default;
const open = require("open");
const qs = require("qs");

const code_verifier = pkceChallenge()["code_verifier"];
const code_challenge = pkceChallenge()["code_challenge"];
const client_id = "8e19f1bdd74b9844b0430147618e5175";
const client_secret =
  "18b3a196766b93821a1d0bb2de2633178015eea80096e858fb95f71b0f999286";
code = "";
access_token = "";
const grant_type = "authorization_code";
const state = "STATE";
const response_type = "code";

// get the api key form myanime list
async function get_api_key() {
  return new Promise((resolve, reject) => {
    // start sever
    var server = http.createServer(function (req, res) {
      if (req.url.split("?")[0] == "/anime") {
        try {
          // get access to URLSearchParams object
          // new URL object
          const current_url = new URL("http://" + req.headers.host + req.url);
          const search_params = current_url.searchParams;
          code = search_params.get("code");
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
                  "Content-Type":
                    "application/x-www-form-urlencoded;charset=utf-8",
                },
              }
            )
            .then(function (response) {
              // handle success
              console.log("[+] access_token ok");
              //console.log(response.data);
              access_token = response.data.access_token;

              resolve(access_token);
            })
            .catch(function (error) {
              // handle error
              console.log("[-]" + `${error}`);
              reject(error);
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
    console.log("[*] Node.js web server at port 3000 is running..");
    console.log("[*] waiting for api key..");

    //Opens the URL in the default browser.
    const open_url = `https://myanimelist.net/v1/oauth2/authorize?response_type=${response_type}&client_id=${client_id}&code_challenge=${code_challenge}&state=${state}`;
    // console.log(open_url);
    open(open_url, { wait: true });
  });
}

module.exports = get_api_key;
