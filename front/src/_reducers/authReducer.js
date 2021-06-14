import * as actions from '../_actions/Types'

import { loadState } from "../Components/localStorage";
// import rootReducer from "../_reducers"


/* Store Login */
const persistedState = loadState("auth-admin")
let initAuthState;

if (persistedState === undefined) {
    initAuthState = {
        logged: false,
        userData: {}
    }
} else {
    initAuthState = persistedState
}


const authReducer = (state = initAuthState, action) => {
    switch (action.type) {
        case actions.LOGGED: return action.payload
        case actions.NOT_LOGGED: return action.payload
        default: return state
    }
}

export default authReducer