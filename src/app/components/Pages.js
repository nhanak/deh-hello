/**
 * Created by Neil on 9/12/2016.
 */
/**
 * imports required to create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import { LoginForm, LogoutLink } from 'react-stormpath';
import darkBaseTheme from '../../../node_modules/material-ui/styles/baseThemes/darkBaseTheme';
import {blue50} from '../../../node_modules/material-ui/styles/colors';
import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import MuiThemeProvider from '../../../node_modules/material-ui/styles/MuiThemeProvider';
import VisibleLoginFormOld from '../containers/VisibleLoginFormOld';
import RaisedButton from 'material-ui/RaisedButton';


const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

/*
 Set the theme colors
 */
darkBaseTheme.palette.accent1Color = blue50;
const muiTheme = getMuiTheme(darkBaseTheme);

var LoginPageOld = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <VisibleLoginFormOld/>
                </div>
            </MuiThemeProvider>
        );
    }
});

var LoginPage = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <LoginForm>
                        <h1>Login</h1>
                        <p>
                            <input type="text" name="username" placeholder="Username" />
                        </p>
                        <p>
                            <input type="password" name="password" placeholder="Password" />
                        </p>
                        <p spIf="form.error">
                            <strong>Error:</strong> <span spBind="form.errorMessage" />
                        </p>
                        <p>
                            <RaisedButton label="Login" secondary={true} type="submit" value="Login" />
                        </p>
                    </LoginForm>
                </div>
            </MuiThemeProvider>
        );
    }
});


var FourOhFourPage = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <p>404: Resource not found</p>
                </div>
            </MuiThemeProvider>
        );
    }
});

var HomePage = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <p>Welcome home!</p>
                    <LogoutLink>Logout</LogoutLink>
                </div>
            </MuiThemeProvider>
        );
    }
});
export {LoginPage, FourOhFourPage, HomePage};