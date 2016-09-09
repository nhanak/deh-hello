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

var Frame = React.createClass({
  handleLogin: function(){
    return {logged_in: true}
  },
  getInitialState: function() {
    return {logged_in: false}
  },
  render: function(){
    return <VisibleLoginForm handleLogin="this.handleLogin"/>;
  }
});

var Main = React.createClass({
  render: function() {
    return (
        <MuiThemeProvider muiTheme={muiTheme}>
        <div style={styles.container}>
            <Frame/>
        </div>
        </MuiThemeProvider>
    );
  }
});

export default Main;
