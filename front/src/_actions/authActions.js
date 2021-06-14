import * as actions from './Types'

export const logged = payload => {
    return({ 
        type: actions.LOGGED, 
        payload 
    })
}

export const notLogged = payload => {
    return({ 
            type: actions.NOT_LOGGED, 
            payload 
    })
}