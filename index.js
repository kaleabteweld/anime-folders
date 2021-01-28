#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

// cus modules
const myAnimeList_init = require("./modules/myAnimeList/init");
const get_anime_list = require("./modules/get_anime_list");
const get_anime_data = require("./modules/myAnimeList/get_anime_data");
const download = require("./modules/download");
const ico = require("./modules/to_ico_re_size");
const check_folder_icon = require("./modules/check_folder_icon");
const set_folder_icon = require("./modules/set_folder_icon");

// vars
const home_folder = process.argv[2];
if (!home_folder) {
  console.log("[-] enter folder eg. anime-folder c:\\....myanimes");
  process.exit(1);
}

var api_key;
var user_anime_list;
var anime_data;
var anime_pic;

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

// main
async function start() {
  var conter = 0;
  var error_conter = 0;
  var error_name = [];
  user_anime_list.forEach(async (anime) => {
    try {
      let skip = check_folder_icon(home_folder + "\\" + anime);
      if (skip) {
        console.log(`[!] skiping "${anime}" b/c it has an icon`);
        //console.log(`skip conter: ${conter}, error ${error_conter}`);
        if (conter == user_anime_list.length - 1) {
          console.log(
            `\n[x] finshed with <${user_anime_list.length - 1 - error_conter}/${
              user_anime_list.length - 1
            }>`
          );
          process.exit(1);
        }
        conter++;
      } else {
        anime_data = await get_anime_data(api_key, anime);

        anime_pic_url = anime_data.main_picture.large;
        var download_ = await download(anime_pic_url, home_folder, anime);

        if (download_.ok == 1) {
          console.log(`[+] downloading done for ${anime} poster`);
          var ico_ = await ico(download_.file);
          if (ico_.ok == 1) {
            console.log("[+] done makeing icon for " + anime);
            let por_id = await set_folder_icon(ico_.file, anime, conter);
            conter++;
            // console.log(
            //   `ok conter: ${conter}, error ${error_conter} , user_anime_list.length ${user_anime_list.length}`
            // );
            if (conter == user_anime_list.length - 1) {
              console.log(
                `\n[x] finshed with <${
                  user_anime_list.length - 1 - error_conter
                }/${user_anime_list.length - 1}>`
              );
              process.exit(1);
            }
          } else {
            console.log("[-] can not makeing icon for " + anime);
          }
        } else {
          console.log(`[-] can not downloading done for ${anime} poster`);
          error_conter++;
        }
      }
    } catch (error) {
      //isAxiosError
      if (error.isAxiosError) {
        console.log(error.data);
        error_conter++;
        conter++;
        error_name.push(anime);
        if (conter == user_anime_list.length) {
          console.log(
            `\n[x] finshed with <${user_anime_list.length - 1 - error_conter}/${
              user_anime_list.length - 1
            }>`
          );
          error_cor(api_key, error_name)
            .then(async (data) => {
              var max = data.length;
              var conter = 0;
              data.forEach(async (anime_data) => {
                anime_pic_url = anime_data.main_picture.large;
                var download_ = await download(
                  anime_pic_url,
                  home_folder,
                  anime
                );

                if (download_.ok == 1) {
                  console.log(`[+] downloading done for ${anime} poster`);
                  var ico_ = await ico(download_.file);
                  if (ico_.ok == 1) {
                    console.log("[+] done makeing icon for " + anime);
                    let por_id = await set_folder_icon(
                      ico_.file,
                      anime,
                      conter
                    );
                    conter++;
                    // console.log(`ok conter: ${conter}, max - 1 ${max - 1} `);
                    if (conter == max) {
                      console.log(
                        `\n[x] finshed with <${conter}/${error_name.length}>`
                      );
                      process.exit(1);
                    }
                  } else {
                    console.log("[-] can not makeing icon for " + anime);
                  }
                } else {
                  console.log(
                    `[-] can not downloading done for ${anime} poster`
                  );
                  error_conter++;
                }
              });
            })
            .catch((error) => {
              console.log(error);
              process.exit(1);
            });
        }
      }
      // any other error
      else {
        //console.log(error);
        error_name.push(anime);
        error_conter++;
        conter++;
      }
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
    api_key = await myAnimeList_init();
    start();
  } catch (error) {
    console.log("[-] API connection error");
  }
}

api_init();
