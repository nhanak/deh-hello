import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {LoginPage, HomePage, FourOhFourPage} from './components/Pages'; // Our custom react component
import { createStore } from 'redux' //Redux
import { Provider } from 'react-redux'
import dehHelloApp from './reducers'
import { Router, Route, Link, browserHistory, Redirect} from 'react-router';//react-routers so we can do routes
import { LoginStatus } from './actions'

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
export const getRoutes = function(store) {
    return (<div>
                <Route path="/" component={HomePage} onEnter={checkAuthentication}/>
                <Route path="/login" component={LoginPage} />
                <Route path="/404" component={FourOhFourPage}/>
                <Redirect from='*' to='/404' />
            </div>
    );
};

// Function that checks if we are authenticated
let checkAuthentication = (nextState, replace)=> {
    if (store.getState().loginStatus != LoginStatus.LOGGED_IN) {
        // Not authenticated, redirect to login.
        console.log('We are not logged in');
        replace('/login');
    }
    else {
        console.log('We are logged in');
    }
};

// Create the redux store
let store = createStore(dehHelloApp);

//Render the application
render((<Provider store={ store }>
            <Router history={browserHistory }>
                { getRoutes(store) }
            </Router>
        </Provider>),
        document.getElementById('app')
);
