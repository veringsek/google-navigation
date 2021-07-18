// console.log("Google Navigation Dev Mode");

let GoogleNavigation = {};
GoogleNavigation.GN_KEYDOWN_TIMER_DURATION = 1000;
GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED = 'GN_KEYDOWN_TIMER_CANCELED';
globalThis.GoogleNavigation = GoogleNavigation;

function colorMode() {
    document.documentElement.style.setProperty(
        '--google-navigation--stroke-color',
        window.getComputedStyle(document.body)['color']
    );
    document.documentElement.style.setProperty(
        '--google-navigation--background-color',
        window.getComputedStyle(document.body)['backgroundColor']
    );
}

function makeTemplate() {
    let template = document.createElement('a');
    template.classList.add('google-navigation--button');
    globalThis.GoogleNavigation.buttonTemplate = template;
}

function getClonedButton(key, string) {
    let cloned = globalThis.GoogleNavigation.buttonTemplate.cloneNode();
    cloned.innerHTML = string ?? key;
    cloned.classList.add(`google-navigation--button-${key}`);
    return cloned;
}

function plantButtons() {
    let links = [...document.getElementsByClassName('LC20lb')];
    let num = 0;
    for (let link of links) {
        if (isDescendantOf(link, [...document.getElementsByClassName('kno-kp')])) continue;
        if (num >= 10) continue;
        let cloned = num === 0 ? getClonedButton('Enter', '⮨') : getClonedButton(num);
        cloned.style.top = `${link.offsetTop}px`;
        link.insertBefore(cloned, link.children[0]);
        num += 1;
    }

    let wikiWholepage = document.getElementsByClassName('kp-wholepage')[0];
    let wikiContent = document.getElementById('kp-wp-tab-cont-overview');
    if (wikiWholepage) {
        let cloned = getClonedButton('p', 'P');
        cloned.style.top = '12px';
        cloned.href = wikiContent.getElementsByTagName('a')[0].href;
        wikiWholepage.insertBefore(cloned, wikiWholepage.children[1]);
    }

    let pnprev = document.getElementById('pnprev');
    if (pnprev) {
        let cloned = getClonedButton(',', '，');
        cloned.style.top = '-3px';
        cloned.style.left = '-40px';
        pnprev.style.position = 'relative';
        pnprev.insertBefore(cloned, pnprev.children[0]);
    }
    let pnnext = document.getElementById('pnnext');
    if (pnnext) {
        let cloned = getClonedButton('.', '‧');
        cloned.style.top = '-3px';
        cloned.style.left = 'calc(100% + 5px)';
        pnnext.style.position = 'relative';
        pnnext.insertBefore(cloned, pnnext.children[0]);
    }
}

function isCommanding(tagName) {
    return !(['INPUT', 'TEXTAREA'].includes(tagName));
}

function isDescendantOf(element, grandParents) {
    let node = element;
    let check = Array.isArray(grandParents) ? node => grandParents.includes(node) : Object.is;
    while (node) {
        if (check(node)) {
            return true;
        }
        node = node.parentElement;
    }
    return false;
}

document.body.addEventListener('keydown', function (ev) {
    if (globalThis.GoogleNavigation.keydowns.has(ev.key)) return;
    globalThis.GoogleNavigation.keydowns.add(ev.key);
    if (isCommanding(ev.target.tagName)) {
        let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
        if (button) {
            button.classList.add('keydown');
            let documentElement = document.documentElement;
            documentElement.scroll({
                top: button.getBoundingClientRect().top + documentElement.scrollTop - window.innerHeight / 2,
                behavior: 'smooth'
            });
            globalThis.GoogleNavigation.tmrKeydown = globalThis.setTimeout(() => {
                globalThis.clearTimeout(globalThis.GoogleNavigation.tmrKeydown);
                globalThis.GoogleNavigation.tmrKeydown = globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED;
                button.classList.remove('keydown');
            }, globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_DURATION);
        }
    }
});

document.body.addEventListener('keyup', function (ev) {
    globalThis.GoogleNavigation.keydowns.delete(ev.key);
    if (globalThis.GoogleNavigation.tmrKeydown === globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED || !globalThis.GoogleNavigation.tmrKeydown) {
        globalThis.GoogleNavigation.tmrKeydown = undefined;
        return;
    }
    globalThis.clearTimeout(globalThis.GoogleNavigation.tmrKeydown);
    globalThis.GoogleNavigation.tmrKeydown = undefined;
    if (isCommanding(ev.target.tagName)) {
        let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
        if (button) {
            button.classList.remove('keydown');
            button.click();
        }
    }
});

globalThis.GoogleNavigation.keydowns = new Set();
globalThis.GoogleNavigation.tmrKeydown = undefined;

colorMode();
makeTemplate();
plantButtons();