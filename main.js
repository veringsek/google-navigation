function makeTemplate() {
    let template = document.createElement('a');
    template.classList.add('google-navigation--button');
    globalThis.gnButtonTemplate = template;
}

function getClonedButton(key, string) {
    let cloned = globalThis.gnButtonTemplate.cloneNode();
    cloned.innerHTML = string ?? key;
    cloned.classList.add(`google-navigation--button-${key}`);
    return cloned;
}

function plantButtons() {
    let links = [...document.getElementsByClassName('LC20lb')];
    let num = 0;
    for (let link of links) {
        if (isDescendantOf(link, [...document.getElementsByClassName('kno-kp')])) {
            continue;
        }
        if (num >= 10) {
            continue;
        }
        let cloned;
        if (num === 0) {
            cloned = getClonedButton('Enter', '⮨');
        } else {
            cloned = getClonedButton(num);
        }
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
    if (isCommanding(ev.target.tagName)) {
        let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
        if (button) {
            button.classList.add('keydown');
            let documentElement = document.documentElement;
            documentElement.scroll({
                top: button.getBoundingClientRect().top + documentElement.scrollTop - window.innerHeight / 2,
                behavior: 'smooth'
            })
        }
    }
});

document.body.addEventListener('keyup', function (ev) {
    if (isCommanding(ev.target.tagName)) {
        let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
        if (button) {
            button.classList.remove('keydown');
            button.click();
        }
    }
});

makeTemplate();
plantButtons();