import * as actions from '../constants'


/* Store Login */
let initAuthState = {
    isLogged: false,
    userData: {}
};

const authReducer = (state = initAuthState, action) => {
    switch (action.type) {
        case actions.LOGGED: {
            return action.payload
        }
        case actions.NOT_LOGGED: {
            return action.payload
        }
        default: return state
    }
};

export default authReducer