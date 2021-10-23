// This program is for generating userscript from files located in /chromium/src/

const fs = require('fs');

const pathChromiumManifest = `./chromium/src/manifest.json`;
const pathChromiumMessages = `./chromium/src/_locales/en/messages.json`;
const pathChromiumMessagesZH = `./chromium/src/_locales/zh/messages.json`;
const pathChromiumCss = `./chromium/src/main.css`;
const pathChromiumJs = `./chromium/src/main.js`;
const pathUserscript = `./userscript/src/main.js`;

let manifest = JSON.parse(fs.readFileSync(pathChromiumManifest, 'utf-8'));
let en = JSON.parse(fs.readFileSync(pathChromiumMessages, 'utf-8'));
let zh = JSON.parse(fs.readFileSync(pathChromiumMessagesZH, 'utf-8'));
let css = fs.readFileSync(pathChromiumCss, 'utf-8');
let js = fs.readFileSync(pathChromiumJs, 'utf-8');
let userscript = `// ==UserScript==
// @name                ${en.appName.message}
// @name:zh-TW          ${zh.appName.message}
// @name:zh-CN          ${zh.appName.message}
// @namespace           veringsek
${
    manifest.content_scripts[0].matches
    .map(match => `// @match               ${match}`)
    .join('\n')
}
// @grant               none
// @version             ${manifest.version}
// @author              veringsek
// @description         ${en.appDesc.message}
// @description:zh-TW   ${zh.appDesc.message}
// @description:zh-CN   ${zh.appDesc.message}
// ==/UserScript==

(function () {
    let css = document.createElement('style');
    css.type = 'text/css';
    css.innerText = \`
${css.split('\n').map(line => `        ${line}`).join('\n')}
    \`;
    document.head.appendChild(css);
})();

${js}`;
fs.writeFileSync(pathUserscript, userscript);