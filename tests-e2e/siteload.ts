import {describe, beforeEach} from "mocha";
import {Builder, By, Capabilities, Key} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome";
import { assert } from "chai";
import {FileDetector} from 'selenium-webdriver/remote/index';
import * as App from '../src/server/app'
import * as http from 'http'
import {SocketManager} from "../src/server/rtc/socketmanager";
import {HostModel} from "../src/server/models/models";

require('chromedriver');
const homeDir = require('os').homedir();
const fs = require('fs');
const path = require('path');
const express = require('express');

describe("site loads", () => {
   /*let server: http.Server;
   let map: Map<string, HostModel>;
   let socketManager: SocketManager;

   beforeEach(done => {
      map = new Map();
      let app = App.newInstance(map);
      console.log(path.join(__dirname, "../dist/client/javascript"));
      app.use('/javascript', express.static(path.join(__dirname, "../dist/client/javascript")));
      server = http.createServer(app);
      socketManager = new SocketManager(server, map);

      server.listen(3000);
      server.on('listening', () => {
         console.log("Server started");
         done()
      });
   });*/

   it("loads", async () => {
      let hdriver = await new Builder().forBrowser('chrome').setChromeOptions(new Options()
          .addArguments("--window-size=1920,1080")
          .addArguments("--allow-insecure-localhost")
          .addArguments("--ignore-certificate-errors")
      ).build();
      let cdriver = await new Builder().forBrowser('chrome').setChromeOptions(new Options()
          .addArguments("--window-size=1920,1080")
          .addArguments("--allow-insecure-localhost")
          .addArguments("--ignore-certificate-errors")
          .setUserPreferences({
             "download.default_directory": homeDir.toString() + "/",
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
          await new Promise(resolve => {
              setTimeout(() => resolve(), 10000);
          });

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

          var bufA = fs.readFileSync(__filename);
          var bufB = fs.readFileSync(path.join(homeDir, path.basename(__filename)));

          assert.isTrue(bufA.equals(bufB));

          fs.unlinkSync(path.join(homeDir, path.basename(__filename)));


      } finally {
          await hdriver.quit();
          await cdriver.quit();
      }
   })
});