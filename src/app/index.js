/**
 * Created by Neil on 9/8/2016.
 */
import { createStore } from 'redux'
import dehHelloApp from './reducers'
import { setVisibilityFilter, VisibilityFilters, setLoginStatus, LoginStatus } from './actions'

function testRedux(){
    let store = createStore(dehHelloApp)
// Log the initial state
    console.log(store.getState())

// Every time the state changes, log it
// Note that subscribe() returns a function for unregistering the listener
    let unsubscribe = store.subscribe(() =>
        console.log(store.getState())
    )

// Dispatch some actions
    store.dispatch(setVisibilityFilter(VisibilityFilters.HIDE_ALL))
    store.dispatch(setLoginStatus(LoginStatus.LOGGED_IN))

// Stop listening to state updates
    unsubscribe()
}
var store = createStore(dehHelloApp);
let unsubscribe = store.subscribe(() =>
    console.log(store.getState())
)
export default store;