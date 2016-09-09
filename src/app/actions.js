/**
 * Created by Neil on 9/8/2016.
 */
/*
 * action types
 */

export const SET_LOGIN_STATUS = 'SET_LOGIN_STATUS'
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER'
export const SET_PAGE = 'SET_PAGE'
/*
 * other constants
 */

export const Pages = {
    LOGIN: 'LOGIN',
    HOME:'HOME',
    MESSAGE: 'MESSAGE',
    INBOX: 'INBOX'

}
export const VisibilityFilters = {
    SHOW_ALL: 'SHOW_ALL',
    HIDE_ALL: 'HIDE_ALL'
}

export const LoginStatus = {
    LOGGED_IN: 'LOGGED_IN',
    LOGGED_OUT: 'LOGGED_OUT'
}

/*
 * action creators
 */


export function setVisibilityFilter(filter) {
    return { type: SET_VISIBILITY_FILTER, filter }
}

export function setLoginStatus(status){
    return { type: SET_LOGIN_STATUS, status }
}

export function setPage(page){
    return {type: SET_PAGE, page }
}

