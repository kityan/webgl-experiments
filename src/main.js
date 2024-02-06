import classes from './misc/styles.scss'
import './misc/webgl-utils.js?global'
import getApp from './apps'


const appsQty = 7

const pushAndRun = num => {
    window.history.pushState({ num }, num, `#${num}`)
    getApp(num)()
}

// appSelector
const s = document.createElement('div')

document.querySelector('body').appendChild(s)

s.classList.add(classes.appSelector)

new Array(appsQty).fill(null).map((item, index) => {
    const _s = document.createElement('button')
    _s.innerText = index + 1;
    s.appendChild(_s)
})

s.addEventListener('click', e => {
    e.stopPropagation();
    pushAndRun(+e.target.innerText)
})

// history

window.addEventListener('popstate', e => getApp(e.state.num)())

// initial url

const urlFragment = window.location.hash.replace('#', '')
let initialAppNum = +urlFragment | 0

if (!(!isNaN(initialAppNum) && urlFragment === initialAppNum + '' && initialAppNum >= 1 && initialAppNum <= appsQty)) {
    // redirect
    pushAndRun(1)
} else {
    getApp(initialAppNum)()
}
