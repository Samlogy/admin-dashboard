import * as actions from '../_actions/Types'

const initState = {}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case actions.LOGGED: return action.payload
        case actions.NOT_LOGGED: return action.payload
        default: return state
    }
}

export default authReducer