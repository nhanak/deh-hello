import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {LoginPage, HomePage, FourOhFourPage, InboxPage} from './components/Pages'; // Our custom react component
import { createStore } from 'redux' //Redux
import { Provider } from 'react-redux'
import dehHelloApp from './reducers'
import { Route, Link, browserHistory, Redirect} from 'react-router';//react-routers so we can do routes
import ReactStormpath, { Router, AuthenticatedRoute, LoginRoute, HomeRoute, LogoutRoute,UserProfileForm } from 'react-stormpath'; //Stormpath
import { LoginStatus } from './actions'
// Create the redux store
let store = createStore(dehHelloApp);

ReactStormpath.init({
    dispatcher: {
        type: 'redux',
        store: store
    }
});

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

export const getRoutes = function(store) {
    return (<div>
                <LoginRoute path="/login" component={LoginPage} />
                <Route path="/404" component={FourOhFourPage}/>
                <LogoutRoute path="/logout"/>
                <Route path='/' component={HomePage} />
                <HomeRoute path='/login' component={LoginPage} />
                <Redirect from='*' to='/404' />
            </div>
    );
};

// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render((<Provider store={ store }>
            <Router history={browserHistory }>
                { getRoutes(store) }
            </Router>
        </Provider>),
        document.getElementById('app')
);

//<AuthenticatedRoute>
//    <HomeRoute path='/' component={HomePage} />
//</AuthenticatedRoute>

//<Route path='/' component={HomePage} />