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
    let gs = [...document.getElementById('search').getElementsByClassName('g')];
    for (let [i, g] of gs.entries()) {
        let num = i;
        let cloned;
        if (num === 0) {
            cloned = getClonedButton('Enter', '⮨');
        } else {
            cloned = getClonedButton(num); 
        }
        let h3 = g.getElementsByTagName('h3')[0];
        h3.insertBefore(cloned, h3.children[0]);
    }

    let wikiWholepage = document.getElementsByClassName('kp-wholepage')[0]; 
    // let wikiTitle = [...wikiWholepage.getElementsByTagName('h2')].filter(h2 => h2.offsetParent !== null)[0];
    let wikiContent = document.getElementById('kp-wp-tab-cont-overview');
    if (wikiWholepage) {
        let cloned = getClonedButton('w', 'W');
        cloned.style.top = '12px';
        cloned.href = wikiContent.getElementsByTagName('a')[0].href;
        wikiWholepage.insertBefore(cloned, wikiWholepage.children[1]);
    }
}

document.body.addEventListener('keydown', function (ev) {
    if (ev.target.tagName !== 'INPUT') {
        let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
        if (button) {
            button.classList.add('keydown');
        }
    }
});

document.body.addEventListener('keyup', function (ev) {
    if (ev.target.tagName !== 'INPUT') {
        let button = document.getElementsByClassName(`google-navigation--button-${ev.key}`)[0];
        if (button) {
            button.classList.remove('keydown');
            button.click();
        }
    }
});

makeTemplate();
plantButtons();