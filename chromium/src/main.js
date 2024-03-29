let GoogleNavigation = {};
GoogleNavigation.GN_KEYDOWN_TIMER_DURATION = 1000;
GoogleNavigation.GN_KEYDOWN_TIMER_CANCELED = 'GN_KEYDOWN_TIMER_CANCELED';
GoogleNavigation.GN_KEYPRESS_SENSITIVITY = 500;
GoogleNavigation.GN_KEYPRESS_CANCELED = 'GN_KEYPRESS_CANCELED';
GoogleNavigation.GN_BUTTON_SIZE = 30;
GoogleNavigation.GN_BUTTON_SIZE_HALF = GoogleNavigation.GN_BUTTON_SIZE / 2;
GoogleNavigation.keydowns = new Set();
GoogleNavigation.tmrKeydown = undefined;
globalThis.GoogleNavigation = GoogleNavigation;

function setCSSVars() {
    document.documentElement.style.setProperty(
        '--google-navigation--button-size',
        `${globalThis.GoogleNavigation.GN_BUTTON_SIZE}px`
    );
    document.documentElement.style.setProperty(
        '--google-navigation--stroke-color',
        globalThis.getComputedStyle(document.body)['color']
    );
    document.documentElement.style.setProperty(
        '--google-navigation--background-color',
        globalThis.getComputedStyle(document.body)['backgroundColor']
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
            this.commandCancel();
        }, globalThis.GoogleNavigation.GN_KEYDOWN_TIMER_DURATION);
    };
    template.commandKeyup = function () {
        this.classList.remove('keydown');
        this.commandPress();
    };
    template.commandPress = function () {
        if (document.getElementById('google-navigation--switch-Control').keydown) {
            window.open(this.link, '_blank');
        } else {
            window.open(this.link, '_self');
        }
    };
    template.commandCancel = function () {
        return;
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
    cloned.commandPress = globalThis.GoogleNavigation.buttonTemplate.commandPress;
    cloned.commandCancel = globalThis.GoogleNavigation.buttonTemplate.commandCancel;
    cloned.innerHTML = string;
    cloned.classList.add(`google-navigation--button-${key}`);
    if (link) {
        cloned.link = link;
        cloned.setAttribute('link', link);
    }
    return cloned;
}

function plantButtons() {
    let search = document.getElementById('search');
    let rcnt = document.getElementById('rcnt');
    let links = [...document.getElementsByClassName('LC20lb')];
    let num = 0;
    for (let link of links) {
        if (getCollapseSectionParent(link)) continue;
        if (num >= 10) break;
        let href = link.parentElement.href;
        let cloned;
        cloned = getClonedButton(num, href);
        cloned.style.top = `${link.offsetTop + link.clientHeight / 2 - GoogleNavigation.GN_BUTTON_SIZE_HALF}px`;
        link.insertBefore(cloned, link.children[0]);

        let node = link;
        let notInRcnt = false;
        do {
            if (!(node instanceof Element)) {
                notInRcnt = true;
                break;
            }
            let style = window.getComputedStyle(node);
            if (style['overflow'] === 'hidden') {
                node.style.overflow = 'visible';
            }
            if (style['contain'] === 'layout paint') {
                node.style.contain = 'unset';
            }
            node = node.parentElement;
        } while (node !== rcnt);
        if (notInRcnt) continue;
        
        setButtonEnter(document.activeElement === document.body);
        num += 1;
    }

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

    let btnWiki = document.getElementsByClassName('ruhjFe')[0];
    if (btnWiki) {
        let cloned = getClonedButton(['p', 'P'], btnWiki.href);
        let card = getWidgetParent(btnWiki);
        if (!card) {
            card = document.getElementById('rhs');
            cloned.style.left = `calc(2 / 3 * var(--google-navigation--button-size) + 100%)`;
        }
        card.style.position = 'relative';
        card.insertBefore(cloned, card.children[0]);
    }

    let translatorWidgetMain = document.getElementById('tw-main');
    let translatorWidgetSourceTextTA = document.getElementById('tw-source-text-ta');
    if (translatorWidgetMain && translatorWidgetSourceTextTA) {
        let cloned = getClonedButton(['t', 'T']);
        let rectMain = translatorWidgetMain.getBoundingClientRect();
        let rectText = translatorWidgetSourceTextTA.getBoundingClientRect();
        let top = (rectText.bottom + rectText.top) / 2 - rectMain.top - GoogleNavigation.GN_BUTTON_SIZE_HALF;
        cloned.style.top = `${top}px`;
        cloned.commandPress = function () {
            document.getElementById('tw-source-text-ta').focus();
        };
        translatorWidgetMain.style.position = 'relative';
        translatorWidgetMain.insertBefore(cloned, translatorWidgetMain.children[0]);
    }

    let calculatorWidget = document.getElementById('cwos')?.parentElement?.parentElement;
    if (calculatorWidget) {
        let calculatorWidgetParent = getWidgetParent(calculatorWidget);
        let cloned = getClonedButton(['t', 'T']);
        let top = calculatorWidgetParent.clientHeight / 2 - globalThis.GoogleNavigation.GN_BUTTON_SIZE_HALF;
        cloned.style.top = `${top}px`;
        cloned.commandPress = function () {
            document.getElementById('cwos').parentElement.parentElement.focus();
        };
        calculatorWidgetParent.insertBefore(cloned, calculatorWidgetParent.children[0]);
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

function isCommanding() {
    let target = document.activeElement;
    return !(['INPUT', 'TEXTAREA'].includes(target.tagName) || target.classList.contains('jlkklc'));
}

function cssVar(name) {
    return globalThis.getComputedStyle(document.documentElement).getPropertyValue(name);
}

function getParent(element, condition) {
    let node = element;
    do {
        if (condition(node)) return node;
        node = node.parentElement;
    } while (node !== document.body);
    return null;
}

function getWidgetParent(element) {
    return getParent(element, node => {
        let computedStyle = globalThis.getComputedStyle(node);
        let borderWidth = computedStyle.borderWidth;
        return borderWidth !== '' && !(/^0\D*/.test(borderWidth));
    });
}

function getCollapseSectionParent(element) {
    return getParent(element, node => node.getAttribute('jscontroller') === 'Da4hkd');
}

function assignEventListeners() {
    let onFocusChanged = function (ev) {
        document.documentElement.style.setProperty(
            '--google-navigation--button-opacity',
            isCommanding() ? 1 : 0.5
        );
        setButtonEnter(document.activeElement === document.body);
    };
    window.addEventListener('focus', onFocusChanged, true);
    window.addEventListener('blur', onFocusChanged, true);

    document.body.addEventListener('keydown', function (ev) {
        if (globalThis.GoogleNavigation.keydowns.has(ev.key)) return;
        globalThis.GoogleNavigation.keydowns.add(ev.key);
        if (isCommanding()) {
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
        if (isCommanding()) {
            let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
            if (button) {
                button.commandKeyup();
            }
        }
    });
}

function setButtonEnter(enabled) {
    let btn0 = document.getElementsByClassName('google-navigation--button-0')[0];
    if (enabled) {
        btn0.innerHTML = '⮨';
        btn0.classList.add('google-navigation--button-Enter');
    } else {
        btn0.innerHTML = '0';
        btn0.classList.remove('google-navigation--button-Enter');
    }
}

setCSSVars();
makeTemplate();
plantButtons();
assignEventListeners();