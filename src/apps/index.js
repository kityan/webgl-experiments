import app1 from './001'
import app2 from './002'
import app3 from './003'
import app4 from './004'
import app5 from './005'
import app6 from './006'
import app7 from './007'

export default function app(num) {
    switch (num) {
        case 1: return app1
        case 2: return app2
        case 3: return app3
        case 4: return app4
        case 5: return app5
        case 6: return app6
        case 7: return app7
        default: return function () { throw 'NO APP' }
    }
}