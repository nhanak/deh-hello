/**
 * Created by Neil on 9/12/2016.
 */
/**
 * imports required to create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import darkBaseTheme from '../../../node_modules/material-ui/styles/baseThemes/darkBaseTheme';
import {blue50} from '../../../node_modules/material-ui/styles/colors';
import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import MuiThemeProvider from '../../../node_modules/material-ui/styles/MuiThemeProvider';
import VisibleLoginForm from '../containers/VisibleLoginForm';
import VisibleHomeBar from '../containers/VisibleHomeBar';

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

var LoginPage = React.createClass({
    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div style={styles.container}>
                    <VisibleLoginForm/>
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
                </div>
            </MuiThemeProvider>
        );
    }
});
export {LoginPage, FourOhFourPage, HomePage};