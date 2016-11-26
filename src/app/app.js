import React from 'react';
import {render} from 'react-dom';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {LoginPage, HomePage, FourOhFourPage} from './components/Pages'; // Our custom react component
import { Route, Link, browserHistory, Redirect} from 'react-router';//react-routers so we can do routes
import createHistory from 'history/createBrowserHistory'
import ReactStormpath, { Router, AuthenticatedRoute, LoginRoute, HomeRoute, LogoutRoute,UserProfileForm } from 'react-stormpath'; //Stormpath
// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
export const getRoutes = function() {
    return (<div>
            <LoginRoute path="/login" component={LoginPage} />
            <Route path="/404" component={FourOhFourPage}/>
            <LogoutRoute path="/logout"/>
            <AuthenticatedRoute>
                <HomeRoute path='/' component={HomePage} />
            </AuthenticatedRoute>
            <HomeRoute path='/login' component={LoginPage} />
            <Redirect from='*' to='/404' />
        </div>
    );
};
ReactStormpath.init({
    // See the API docs for available configuration options.
});
// Render the main app react component into the app div.
// For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
render(<Router history={browserHistory }>
        { getRoutes() }
    </Router>,
    document.getElementById('app')
);