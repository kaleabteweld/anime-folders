const axios = require("axios").default;

async function get_data(access_token, anime_name) {
  console.log("[*] looking for " + anime_name);

  return new Promise((resovle, reject) => {
    axios
      .get(`https://api.myanimelist.net/v2/anime?q='${anime_name}'`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .then((res) => {
        data = res.data.data[0].node;
        if (data != undefined) {
          console.log("[+] found " + anime_name);
          resovle(data);
        } else {
          console.log("[-] Can not find anime with the name " + anime_name);
          reject("404");
        }
      })
      .catch((error) => {
        console.log("[-] error while finding..... " + anime_name);
        console.log(`https://api.myanimelist.net/v2/anime?q="${anime_name}"`);
        reject(error);
      });
  });
}

module.exports = get_data;
