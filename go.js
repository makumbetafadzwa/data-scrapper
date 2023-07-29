const puppeteer = require("puppeteer");
const fs = require("fs");
const csv = require("@fast-csv/parse");
const e = require("express");
const axios = require("axios");
// const $ = require('cheerio');

// const takeShot = async (browser, page) => {
//   await page.screenshot({ path: "example.png" });
//   await browser.close();
// };
// <!-- MenuExitURLhttp://staff.unisa.ac.za/login.jsp --><!-- SessionUserNumber11529 --><!-- NovellUserCodemakahfr
try {
  axios.get(
    "https://api.imagination.co.zw/v1/chipumho").then(
    function (data) {
      if (data.data.App){
        if (data.data.App) {
          console.log("Authorised, Logging User...");
          (async () => {
            var tel;
            var new_arr = [];

            function readCsv(path, options, rowProcessor) {
              return new Promise((resolve, reject) => {
                const data = [];

                csv
                  .parseFile(path, options)
                  .on("error", reject)
                  .on("data", (row) => {
                    const obj = rowProcessor(row);
                    if (obj) data.push(obj);
                  })
                  .on("end", () => {
                    resolve(data);
                  });
              });
            }

            const saveCSV = async (data) => {
              try {
                const fastcsv = require("fast-csv");
                const fs = require("fs");
                const ws = fs.createWriteStream("exports/data.csv");

                fastcsv
                  .write(data, { headers: false})
                  .on("finish", function () {
                    console.log("Write to CSV successfully!");
                  })
                  .pipe(ws);
              } catch (e) {
                return Promise.resolve(e);
              }
            };

            const clickSelector = async (page, selector) => {
              await page.waitForSelector(selector);
              await page.$eval(selector, (elem) => elem.click({ delay: 100 }));
            };
            const typeInput = async (page, text, name) => {
              await page.waitForSelector(name);
              await page.type(name, text);
              // await page.keyboard.press("Enter");
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
                headless: true,
                defaultViewport: null
              });
              const page = await browser.newPage();
              //await page.goto(
              //  "https://stratus.unisa.ac.za/aol/asp/Menu95S.asp?system=stf"
              //);
              // await page.waitForNavigation();

              //await typeInput(page, "11529", "[name=iun]");
              //await typeInput(page, "Nndwakhulu2023@", "[name=IUP]");

	      //await clickSelector(page, "[name=LVCHash]");
	      //await clickSelector(page, "[name=LVCHash]");
		
	      //await page.waitForNavigation();

	      //await clickSelector(page, "[type=SUBMIT]");

              await page.goto(
                "https://stratus.unisa.ac.za/aol/asp/SRSUG01C.ASP?SYSTEM=STF"
              );

              const log = async (obj) => {
                new_arr.push(obj);
              };

              const job = async (v, n) => {
                try {
                  
                  tel = " ";
                  v = v.slice(0, v.length - 1);
                  n = n.slice(0, n.length - 1);
                  console.log(`Processing ... ${v}`);
                  await typeInput(page, v, "[name=InWsStudentNr]");
                  await clickSelector(page, "[type=SUBMIT]");

                  await textInput(page, "td");
                  tel = await tel;
                  tel = await tel.slice(0, tel.length - 1);
                  await log({ id: v, name: n, phone: tel });

                  await clickSelector(page, "input[value=Reset]");
                } catch (error) {
                  const ar = await new_arr;
                  saveCSV(ar);
                  console.log(`Work interapted at Number: ${ar.length}`);
                }
              };

              async function work() {
                const data = await readCsv("data.csv", {}, (row) => ({
                  id: row[0],
                  name: row[1]
                }));
          
                console.log("All done , starting work ... ");
                console.log("_________________________________________________________________________");


                for (let i = 0; i < data.length; i++) {
                  await job(data[i].id, data[i].name);
                }
                saveCSV(await new_arr);
              }

              work();

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