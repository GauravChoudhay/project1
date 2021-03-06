const puppeteer = require('puppeteer');
const fs = require('fs');
const prompt = require("prompt-sync")({sigint:true});
const lC  = require("./loginCredentials.js");
let shareName = prompt("Which Share You Want to Track Sir : ");


(async function () {
    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized"],
    });

    let allPages = await browser.pages();
    let tab = allPages[0];

    await tab.goto("https://in.tradingview.com");

    await tab.waitForSelector(".tv-header__link.tv-header__link--signin.js-header__signin", { visible: true })
    await tab.click(".tv-header__link.tv-header__link--signin.js-header__signin");
    await tab.waitForSelector(".tv-signin-dialog__social.tv-signin-dialog__toggle-email.js-show-email", { visible: true })
    await tab.click(".tv-signin-dialog__social.tv-signin-dialog__toggle-email.js-show-email");
    await tab.waitForSelector('.tv-control-material-input.tv-signin-dialog__input.tv-control-material-input__control[autocomplete="username"]', { visible: true });
    await tab.type('.tv-control-material-input.tv-signin-dialog__input.tv-control-material-input__control[autocomplete="username"]' , lC.id);
    await tab.type('.tv-control-material-input.tv-signin-dialog__input.tv-control-material-input__control[autocomplete="current-password"]' , lC.pw);
    await tab.click(".tv-button__loader");

    await tab.waitForSelector(".tv-header-search__input.js-header-search__input", { visible: true });
    await tab.type(".tv-header-search__input.js-header-search__input", "@"); // to active inputbox
    await tab.type(".tv-header-search__input.js-header-search__input", shareName);
    for(let i=0;i<shareName.length;i++){
        await backspace(tab);
    }
    await tab.keyboard.press("Backspace");
    await tab.waitForTimeout(1000);
    await tab.keyboard.press("Enter");
    await tab.waitForSelector(".button-1iktpaT1", { visible: true });
    let aTag = await tab.$(".button-1iktpaT1");
    let fullChartLink = await tab.evaluate(function (elem) { return elem.getAttribute("href"); }, aTag);
    let completeFullChartLink = "https://in.tradingview.com" + fullChartLink;

    await chart(browser, completeFullChartLink);


})();

async function chart(browser, completeFullChartLink) {
    let newTab = await browser.newPage();
    await newTab.goto(completeFullChartLink);
    await newTab.waitForSelector("#header-toolbar-indicators", { visible: true });
    await newTab.click("#header-toolbar-indicators")
    await newTab.waitForSelector(".input-3n5_2-hI", { visble: true });
    await newTab.type(".input-3n5_2-hI", "macd");
    await newTab.waitForSelector(".container-3Ywm3-oo", { visible: true })
    divTags = await newTab.$$(".container-3Ywm3-oo");
    let macdTag = divTags[0];
    await macdTag.click();
    await newTab.type(".input-3n5_2-hI", "rsi");
    divTags = await newTab.$$(".container-3Ywm3-oo");
    let rsiTag = divTags[0];
    await rsiTag.click();
    //await newTab.waitForTimeout(2000);
    await newTab.type(".input-3n5_2-hI", "Parabolic SAR");
    divTags = await newTab.$$(".container-3Ywm3-oo");
    let parSARTag = divTags[1];
    await parSARTag.click();
    await newTab.click(".close-2sL5JydP");
    await newTab.waitForSelector(".item-3SbREAgE.isFirst-3SbREAgE");
    await newTab.click(".item-3SbREAgE.isFirst-3SbREAgE");
}

async function backspace(tab){
    await tab.keyboard.press("ArrowLeft");
}
