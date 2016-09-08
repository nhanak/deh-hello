/**
 * In this file, we create a React component
 * which incorporates components provided by Material-UI.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import {blue50} from 'material-ui/styles/colors';
import FlatButton from 'material-ui/FlatButton';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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

/*
 LoginForm
 */
var LoginForm = React.createClass({
  getInitialState: function() {
    return {logged_in: false}
  },
  render: function(){
    return (
        <div class="login-form">
        <h1>Login</h1>
        <form>
        <p><input type='text' className='username' placeholder="Username"/></p>
        <p><input type='password' className='password' placeholder="Password"/></p>
        </form>
        <RaisedButton
    label="Login"
    secondary={true}
    onTouchTap={this.handleLogin}
    />
    </div>
    );
  }
});

var Frame = React.createClass({
  handleLogin: function(){
    return {logged_in: true}
  },
  getInitialState: function() {
    return {logged_in: false}
  },
  render: function(){
    return <LoginForm handleLogin="this.handleLogin"/>;
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
