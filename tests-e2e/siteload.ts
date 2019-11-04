import {describe, before, after} from "mocha";
import {Builder, By, until, WebDriver, Key} from "selenium-webdriver";
import {Options} from "selenium-webdriver/chrome";
import {assert} from "chai";
import {FileDetector} from 'selenium-webdriver/remote/index';

require('chromedriver');
const homeDir = require('os').homedir();
const fs = require('fs');
const path = require('path');

let hdriver: WebDriver;
let cdriver: WebDriver;

describe("site loads", () => {

    before(async () => {
        hdriver = await new Builder().forBrowser('chrome').setChromeOptions(new Options()
            .addArguments("--window-size=1920,1080")
            .addArguments("--allow-insecure-localhost")
            .addArguments("--ignore-certificate-errors")
        ).build();
        cdriver = await new Builder().forBrowser('chrome').setChromeOptions(new Options()
            .addArguments("--window-size=1920,1080")
            .addArguments("--allow-insecure-localhost")
            .addArguments("--ignore-certificate-errors")
            .setUserPreferences({
                "download.default_directory": homeDir.toString() + "/",
                "download.prompt_for_download": "false",
                "profile.default_content_settings.popups": 0
            })
        ).build();

        hdriver.manage().window().maximize();
        cdriver.manage().window().maximize();

        hdriver.setFileDetector(new FileDetector());

        let complete = false;
        let count = 0;

        while (!complete) {
            await hdriver.get('http://localhost:3000');
            await hdriver.findElement(By.id('paste'))
                .catch((err) => {
                    console.log(err + " try " + count);
                    count++;
                }).then(result => {
                    if (result) {
                        complete = true;
                    }
                });
        }
    });

    it("loads", async () => {
        await hdriver.get('http://localhost:3000');
        await hdriver.findElement(By.id('in')).sendKeys(__filename);
        await hdriver.findElement(By.id('paste')).click();
        await hdriver.wait(until.elementLocated(By.id('dialogcode')));
        let code = await hdriver.findElement(By.id('dialogcode')).getText();
        console.log(code);

        await cdriver.get('http://localhost:3000');
        await cdriver.findElement(By.id('join-room-button')).click();
        await cdriver.findElement(By.id("roominput")).sendKeys(code);
        await cdriver.findElement(By.id("dialogjoin")).click();
        await cdriver.findElement(By.id("download")).click();

        await cdriver.wait(until.elementTextMatches(
            cdriver.findElement(By.id("progress")),
            RegExp("100"))
        );

        /*await cdriver.executeScript("window.open(\"newURL\")");
        //Wait for download to complete
        let tabs = await cdriver.getAllWindowHandles();
        await cdriver.switchTo().window(tabs[1]);
        await cdriver.get("chrome://downloads/");
        await cdriver.executeScript(" var items = downloads.Manager.get().items_;\n" +
            "        if (items.every(e => e.state === \"COMPLETE\"))\n" +
            "            return items.map(e => e.fileUrl || e.file_url);"); //Checks chrome download page for status, kind of hacky*/

        await new Promise(resolve => {
            setTimeout(() => resolve(), 3000)
        });

        var bufA = fs.readFileSync(__filename);
        var bufB = fs.readFileSync(path.join(homeDir, path.basename(__filename)));

        assert.isTrue(bufA.equals(bufB));
    });

    after(() => {
        hdriver.close();
        cdriver.close();

        try {
            fs.unlinkSync(path.join(homeDir, path.basename(__filename)));
        } catch(e) {}
    });
});