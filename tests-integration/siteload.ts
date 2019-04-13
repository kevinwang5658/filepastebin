import {describe} from "mocha";
import {Builder, By, Capabilities, Key} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome";
import { assert } from "chai";
import {FileDetector} from 'selenium-webdriver/remote';

require('chromedriver');
const fs = require('fs');
const path = require('path');

describe("site loads", () => {
   it("loads", async () => {
      let hdriver = await new Builder().forBrowser('chrome').setChromeOptions(new Options()
          .addArguments("--headless")
          .addArguments("--window-size=1920,1080")
          .addArguments("--allow-insecure-localhost")
          .addArguments("--ignore-certificate-errors")
      ).build();
      let cdriver = await new Builder().forBrowser('chrome').setChromeOptions(new Options()
          .addArguments("--window-size=1920,1080")
          .addArguments("--allow-insecure-localhost")
          .addArguments("--ignore-certificate-errors")
          .setUserPreferences({
             "download.default_directory": "/home/kevinwang/Downloads",
             "download.prompt_for_download": "false",
             "profile.default_content_settings.popups": 0
          })
      ).build();

      hdriver.setFileDetector(new FileDetector());

      try {
         hdriver.manage().window().maximize();
         await hdriver.get('http://localhost:3000');

         let text = await hdriver.findElement(By.id('paste')).getText();
         assert.equal(text, "Paste It");

         await hdriver.findElement(By.id('in')).sendKeys(__filename);
         await hdriver.findElement(By.id('paste')).click();
         let code = await hdriver.findElement(By.id('dialogcode')).getText();
         console.log(code);

         cdriver.manage().window().maximize();
         await cdriver.get('http://localhost:3000');

         await cdriver.findElement(By.id('join-room-button')).click();
         await cdriver.findElement(By.id("roominput")).sendKeys(code);
         await cdriver.findElement(By.id("dialogjoin")).click();
         await cdriver.findElement(By.id("download")).click();
         await new Promise(resolve => {
            setTimeout(() => resolve(), 3000)
         });

         await cdriver.takeScreenshot().then(base64png => fs.writeFileSync('/home/kevinwang/screenshot.png', base64png, 'base64'));

         var bufA = fs.readFileSync(__filename);
         var bufB = fs.readFileSync("/home/kevinwang/Downloads/" + path.basename(__filename));

         assert.isTrue(bufA.equals(bufB));

         fs.unlinkSync("/home/kevinwang/Downloads/" + path.basename(__filename))


      } finally {
         await hdriver.quit();
         await cdriver.quit();
      }
   })
});