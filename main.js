let GoogleNavigation = {};
GoogleNavigation.GN_KEYDOWN_TIMER_DURATION = 1000;
GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED = 'GN_KEYDOWN_TIMER_CANCELED';
GoogleNavigation.GN_KEYPRESS_SENSITIVITY = 500;
GoogleNavigation.GN_KEYPRESS_CANCELED = 'GN_KEYPRESS_CANCELED';
GoogleNavigation.keydowns = new Set();
GoogleNavigation.tmrKeydown = undefined;
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
    template.commandKeydown = function () {
        this.classList.add('keydown');
        let documentElement = document.documentElement;
        documentElement.scroll({
            top: this.getBoundingClientRect().top + documentElement.scrollTop - window.innerHeight / 2,
            behavior: 'smooth'
        });
        globalThis.GoogleNavigation.tmrKeydown = globalThis.setTimeout(() => {
            globalThis.clearTimeout(globalThis.GoogleNavigation.tmrKeydown);
            globalThis.GoogleNavigation.tmrKeydown = globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED;
            this.classList.remove('keydown');
        }, globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_DURATION);
    };
    template.commandKeyup = function () {
        this.classList.remove('keydown');
        if (document.getElementById('google-navigation--switch-Control').keydown) {
            window.open(this.link, '_blank');
        } else {
            window.open(this.link, '_self');
        }
    };
    globalThis.GoogleNavigation.buttonTemplate = template;
}

function getClonedButton(key, link) {
    let string = key;
    if (Array.isArray(key)) {
        [key, string] = key;
    }
    let cloned = globalThis.GoogleNavigation.buttonTemplate.cloneNode();
    cloned.commandKeydown = globalThis.GoogleNavigation.buttonTemplate.commandKeydown;
    cloned.commandKeyup = globalThis.GoogleNavigation.buttonTemplate.commandKeyup;
    cloned.innerHTML = string;
    cloned.classList.add(`google-navigation--button-${key}`);
    if (link) {
        cloned.link = link;
        cloned.setAttribute('link', link);
    }
    return cloned;
}

function plantButtons() {
    let links = [...document.getElementsByClassName('LC20lb')];
    let num = 0;
    for (let link of links) {
        if (isDescendantOf(link, [...document.getElementsByClassName('kno-kp')])) continue;
        if (num >= 10) continue;
        let href = link.parentElement.href;
        let cloned = num === 0 ? getClonedButton(['Enter', '⮨'], href) : getClonedButton(num, href);
        cloned.style.top = `${link.offsetTop}px`;
        link.insertBefore(cloned, link.children[0]);
        num += 1;
    }

    let search = document.getElementById('search');
    if (search) {
        let cloned = getClonedButton(['Control', 'CTRL']);
        cloned.id = 'google-navigation--switch-Control';
        cloned.classList.add('google-navigation--switch');
        cloned.style.left = '-150px';
        cloned.style.width = '80px';
        cloned.style.fontWeight = 'bold';
        cloned.keydown = false;
        cloned.commandKeydown = function () {
            this.tmrKeypress = globalThis.setTimeout(() => {
                this.tmrKeypress = globalThis.GoogleNavigation.GN_KEYPRESS_CANCELED;
            }, globalThis.GoogleNavigation.GN_KEYPRESS_SENSITIVITY);
        };
        cloned.commandKeyup = function () {
            if (this.tmrKeypress === globalThis.GoogleNavigation.GN_KEYPRESS_CANCELED) {
                this.tmrKeypress = undefined;
            } else if (this.tmrKeypress) {
                this.keydown = !this.keydown;
                if (this.keydown) {
                    this.classList.add('keydown');
                } else {
                    this.classList.remove('keydown');
                }
            }
        };
        search.insertBefore(cloned, search.children[0]);
    }

    let wikiWholepage = document.getElementsByClassName('kp-wholepage')[0];
    let wikiContent = document.getElementById('kp-wp-tab-cont-overview');
    if (wikiWholepage) {
        let cloned = getClonedButton(['p', 'P'], wikiContent.getElementsByTagName('a')[0].href);
        cloned.style.top = '12px';
        wikiWholepage.insertBefore(cloned, wikiWholepage.children[1]);
    }

    let pnprev = document.getElementById('pnprev');
    if (pnprev) {
        let cloned = getClonedButton([',', '，'], pnprev.href);
        cloned.style.top = '-3px';
        cloned.style.left = '-40px';
        pnprev.style.position = 'relative';
        pnprev.insertBefore(cloned, pnprev.children[0]);
    }
    let pnnext = document.getElementById('pnnext');
    if (pnnext) {
        let cloned = getClonedButton(['.', '‧'], pnnext.href);
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


function assignEventListeners() {
    document.body.addEventListener('keydown', function (ev) {
        if (globalThis.GoogleNavigation.keydowns.has(ev.key)) return;
        globalThis.GoogleNavigation.keydowns.add(ev.key);
        if (isCommanding(ev.target.tagName)) {
            let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
            if (button) {
                button.commandKeydown();
            }
        }
    });

    document.body.addEventListener('keyup', function (ev) {
        globalThis.GoogleNavigation.keydowns.delete(ev.key);
        if (globalThis.GoogleNavigation.tmrKeydown === globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED) {
            globalThis.GoogleNavigation.tmrKeydown = undefined;
            return;
        }
        globalThis.clearTimeout(globalThis.GoogleNavigation.tmrKeydown);
        globalThis.GoogleNavigation.tmrKeydown = undefined;
        if (isCommanding(ev.target.tagName)) {
            let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
            if (button) {
                button.commandKeyup();
            }
        }
    });
}

colorMode();
makeTemplate();
plantButtons();
assignEventListeners();