const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("@fast-csv/parse");
const e = require("express");
const axios = require("axios");

try {
  //add url of the auth api
  axios.get(
    "THE_API_URL").then(
    function (data) {
      if (data.data) {
        if (data.data.App) {
          console.log("Authorised, Logging User ...");
          (async () => {
            var tel;
            var new_arr = [];
            const clickSelector = async (page, selector) => {
              await page.waitForSelector(selector);
              await page.$eval(selector, (elem) => elem.click({ delay: 100 }));
            };
            const typeInput = async (page, text, name) => {
              await page.waitForSelector(name);
              await page.type(name, text);
            };
            const textInput = async (page, name) => {
              await page.waitForSelector("table");
              const pageFrame = page.mainFrame();
              const elems = await pageFrame.$$(name);

              elems.map(async (e, i) => {
                if (i == elems.length - 27 + 10) {
                  tel = page.evaluate((el) => el.textContent, e);
                  console.log(await tel);
                }
              });
            };

            const configureBrowser = async () => {
              const browser = await puppeteer.launch({
		            userDataDir: '/tmp/workSession',
                headless: false,
                defaultViewport: null
              });
              const page = await browser.newPage();
              await page.goto(
               "https://stratus.unisa.ac.za/aol/asp/Menu95S.asp?system=stf"
              );

              await typeInput(page, "_", "[name=iun]");
              await typeInput(page, "_", "[name=IUP]");

              await clickSelector(page, "[name=LVCHash]");
              await clickSelector(page, "[name=LVCHash]");
          

              return page;
            };

            const monitor = async () => {
              await configureBrowser();
            };

            monitor().then(() => {
              console.log("Login Successful");
            });
          })();
        } else {
          console.log(
            "Auth Error, you are not authorized to use this application"
          );
        }
      } else {
        console.log("Network Error, Please Check Your Network ");
      }
    }
  );
} catch(e) {
  console.log(e);
}