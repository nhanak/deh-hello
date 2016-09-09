/**
 * Created by Neil on 9/8/2016.
 */
/**
 * imports required for Redux
 */
import { combineReducers } from 'redux'
import {SET_VISIBILITY_FILTER, VisibilityFilters, SET_LOGIN_STATUS, LoginStatus } from './actions'
const { SHOW_ALL } = VisibilityFilters
const { LOGGED_OUT } = LoginStatus

function visibilityFilter(state = SHOW_ALL, action) {
    switch (action.type) {
        case SET_VISIBILITY_FILTER:
            return action.filter;
        default:
            return state
    }
}

function loginStatus(state = LOGGED_OUT, action) {
    switch (action.type) {
        case SET_LOGIN_STATUS:
            return action.status;
        default:
            return state
    }
}

const dehHelloApp = combineReducers({
    visibilityFilter,
    loginStatus
})

export default dehHelloApp