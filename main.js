let button = document.createElement('div');
button.classList.add('google-navigation--button');

let gs = [...document.getElementsByClassName('g')];
for (let [i, g] of gs.entries()) {
    let num = i + 1;

    let cloned = button.cloneNode();
    cloned.innerHTML = num;
    cloned.classList.add(`google-navigation--button-${num}`);

    let h3 = g.getElementsByTagName('h3')[0]; 
    h3.insertBefore(cloned, h3.children[0]);
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