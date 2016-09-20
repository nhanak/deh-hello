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
import {lightGreenA100,lightGreenA400,lightGreenA200,cyan700} from '../../../node_modules/material-ui/styles/colors';
import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import MuiThemeProvider from '../../../node_modules/material-ui/styles/MuiThemeProvider';
import VisibleLoginFormOld from '../containers/VisibleLoginFormOld';
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { StickyContainer, Sticky } from 'react-sticky';
import RecipientsTable from './RecipientsTable';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 50,
    },
    headerPadding:{
      paddingBottom:25,
    },
    recipientsContainer: {
        textAlign: 'center',
        paddingTop: 50,
        paddingRight:150,
        float:'right',
    },
    messageContainer: {
        textAlign: 'center',
        paddingTop: 50,
        float:'left',
        paddingLeft:700,
    },
    loginContainer:{
        textAlign: 'center',
        paddingTop: 100,
    }
};

/*
 Set the theme colors
 */
//darkBaseTheme.palette.accent1Color = lightGreenA200;
darkBaseTheme.palette.accent2Color = cyan700;
//darkBaseTheme.palette.accent3Color = lightGreenA100;
darkBaseTheme.palette.primary1Color =lightGreenA400;
//darkBaseTheme.palette.primary2Color = blueGrey700;
//darkBaseTheme.palette.primary3Color = blueGrey600;
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
                <div style={styles.loginContainer}>
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
    getInitialState () {
        return {
            value:1,
        };
    },
    getDefaultProps() {
        return {
            handleChange: (event, index, value) => this.setState({value})
        }
    },
    render: function() {
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <StickyContainer>
                        <Sticky>
                            <Toolbar>
                                <ToolbarGroup firstChild={true}>
                                    <DropDownMenu value={this.state.value} onChange={this.handleChange}>
                                        <MenuItem value={1} primaryText="Home" />
                                        <MenuItem value={2} primaryText="Inbox" />
                                    </DropDownMenu>
                                </ToolbarGroup>
                                <ToolbarGroup>
                                        <RaisedButton label="Logout" secondary={true} href="/logout"/>
                                </ToolbarGroup>
                            </Toolbar>
                        </Sticky>
                        <div>
                            <div style={styles.recipientsContainer}>
                                <h1>Recipients</h1>
                                <RecipientsTable/>
                            </div>
                            <div style={styles.messageContainer}>
                                <h1 style={styles.headerPadding}>Message</h1>
                                <textarea rows="10" cols="50" placeholder="Enter message"/>
                                <p></p>
                                <RaisedButton label="Send" secondary={true} type="submit" value="Send" />
                            </div>
                        </div>
                    </StickyContainer>
                </div>
            </MuiThemeProvider>
        );
    }
});
export {LoginPage, FourOhFourPage, HomePage};