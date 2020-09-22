import app1 from './001'
import app2 from './002'
import app3 from './003'
import app4 from './004'

export default function app(num) {
    switch (num) {
        case 1: return app1
        case 2: return app2
        case 3: return app3
        case 4: return app4
        default: return function () { throw 'NO APP' }
    }
}