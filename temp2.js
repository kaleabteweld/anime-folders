// const { exec } = require("child_process");
// const path = require("path");
const myAnimeList_init = require("./modules/myAnimeList/init");
const get_anime_list = require("./modules/get_anime_list");
const get_anime_data = require("./modules/myAnimeList/get_anime_data");

// //const dir = "C:\\Users\\kalea\\Desktop\\temp\\5-toubun no Hanayome 2";

// console.log(`${process.argv}`);
// let pwd = process.argv[1];
// const name = path.basename(pwd).split(".").slice(0, -1).join(".");
// var dir = pwd.split(name)[0];
// console.log(`${dir}custom_folder_icon.bat`);

// exec(
//   `custom_folder_icon.bat "F:\\Video\\anime\\SK∞" "F:\\Video\\anime\\SK∞\\108385l.ico"`,
//   (error, stdout, stderr) => {
//     if (error) {
//       console.log(`error: ${error.message}`);
//       //return;
//     }
//     if (stderr) {
//       //console.log(`stderr: ${stderr}`);
//       //return;
//     }
//     console.log(`stdout: ${stdout}`);
//   }
// );

const home_folder = process.argv[2];
if (!home_folder) {
  console.log("[-] enter folder eg. anime-folder c:\\....myanimes");
  process.exit(1);
}

// error cor
async function error_cor(api, anime_error_list) {
  console.log("[+]retring to fix errors.....");
  var DATA = [];

  return new Promise(async (resolve, reject) => {
    // anime_error_list.forEach(async (anime_name) => {
    var i = 0;
    while (i != anime_error_list.length) {
      anime_name = anime_error_list[i];
      if (anime_name == undefined) {
        resolve(DATA);
        break;
      }
      console.log("[+] working on " + anime_name);

      // if error is in the name
      // try diff names
      if (anime_name.split(" ").length >= 2) {
        var Try = 1;
        const max_try = 6;
        var stop = 0;
        while (stop != 1) {
          try {
            console.log(`[#][${Try}] trying as "${anime_name}"`);
            var data = await get_anime_data(api, anime_name);
            DATA.push(data);
            console.log('[+] found as "' + anime_name + '"');
            i++;
            Try = 1;
            stop = 1;
          } catch (error) {
            //console.log(error);
            let temp = anime_name.split(" ");
            temp = temp[temp.length - Try];
            anime_name = anime_name.replace(temp, "");
            Try++;
            if (Try == max_try) {
              console.log("[-] i give up");
              reject(undefined);
            }
          }
        }
      }
      i++;
    }
  });
}

// init
async function api_init() {
  try {
    user_anime_list = get_anime_list(home_folder);
    if (user_anime_list == -1) {
      process.exit(2);
    }
    let list = await error_cor(await myAnimeList_init(), [
      "SK∞",
      "Suppose a Kid from the Last Dungeon Boonies moved to a starter town",
    ]);
    console.log(list);
  } catch (error) {
    console.log(error);
    console.log("[-] API connection error");
  }
}

api_init();
