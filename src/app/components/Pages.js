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
import RaisedButton from 'material-ui/RaisedButton';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import MenuItem from 'material-ui/MenuItem';
import DropDownMenu from 'material-ui/DropDownMenu';
import { StickyContainer, Sticky } from 'react-sticky';
import InboxTable from './InboxTable';
import Conversation from './Chat';
import HomeGUI from './HomeGUI';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 50,
    },
    headerPadding:{
        paddingBottom:10,
    },

    recipientsContainer: {
        textAlign: 'center',
        paddingTop: 20,
        paddingRight:150,
        float:'right',
    },
    messageContainer: {
        textAlign: 'center',
        paddingTop: 20,
        float:'left',
        paddingLeft:639,
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

/*
 LoginPage: page application redirects to
 when the user is not authenticated via stormpath
 */
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

/*
 FourOhFourPage: Page application redirects to
 when it cannot find the resource
 */
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
/*
 HomePage: Container class. Contains a toolbar with
 content that can be changed from the menu
 */
var HomePage = React.createClass({
    getInitialState () {
        return {
            content: 'home',
            messages: [],
            currentRecipient: '666',
            currentRecipientMessages:[],
            naughtyNumbersList:[],//list of people we are unable to message EVER
            allNumbersList:[]
        };
    },

    addMessageToConversation(message){
        var conversations=this.state.messages;
        var conversationsPure = conversations.filter(function(convoObject){
            return convoObject.recipient!=message.recipient
        });
        var oldConversation = conversations.filter(function(convoObject){
            return convoObject.recipient===message.recipient
        });
        var newConversation = {recipient:oldConversation[0].recipient,messages:message.messages};
        newConversation.messages=oldConversation[0].messages.concat(newConversation.messages);
        var array = [newConversation];
        array = array.concat(conversationsPure);
        return array;
    },

    handleNewMessage:function(conversation){
        console.log('Handling new message...');
        var newConversation=conversation[0];
        var conversationFound=false;
        this.state.messages.forEach(function(convoObject) {
            if (convoObject.recipient === newConversation.recipient) {
                conversationFound = true;
            }
        });
        if (conversationFound===false) {
            var newMessages = this.state.messages.push(newConversation);
            this.setState({
                messages: newMessages,
            });
        }
        else{
            console.log('Conversation exists, adding message to existing conversation');
            this.setState({
                messages:this.addMessageToConversation(newConversation),
            });
        }
    },

    getAllNumbersList:function(result){
        var allNumbersList=[];
        var number;
        result.forEach(function (convoObject) {
            number=convoObject.messages[0].them;
            allNumbersList.push(number);
        });
        //console.log("ALLNUMBERSLIST IS: "+allNumbersList);
        return allNumbersList;

    },
    getNaughtyNumbersList:function(result){
        console.log("Entered getNaughtyNumbersList!");
        var _naughtyNumberList = [];
        result.forEach(function (convoObject) {
            //console.log("ConvoObject looks like: " + JSON.stringify(convoObject) + typeof(convoObject));
            var naughtyBool = false;
            var naughtyNumber;
            //if we have only ever messaged them
            if (convoObject.messages.length<2){
                naughtyBool=true;
                naughtyNumber=convoObject.messages[0].them;
            }
            else {
                //if theres more than one message but they have said no at some point
                convoObject.messages.forEach(function (message) {
                    if (message.body.toLowerCase() === "no") {
                        naughtyBool = true;
                        naughtyNumber = message.them;
                    }
                });
            }
            if (naughtyBool) {
                console.log("ADDING NAUGHTY NUMBER: " + naughtyNumber);
                _naughtyNumberList.push(naughtyNumber);
            }
        });
        return _naughtyNumberList;

    },

    removeMessagesWithNaughtyNumbers(conversations,_naughtyNumberList){
        console.log("Removing messages with naughty numbers!");
        var messagesWithoutNaughtyNumbers=[];
        console.log("NaughtyNumberList is"+_naughtyNumberList);
        conversations.forEach(function(convoObject) {
            console.log("Checking number: "+convoObject.messages[0].them);
            if (_naughtyNumberList.indexOf(convoObject.messages[0].them)>=0) {
                console.log('REMOVED CONVO OBJECT');//+JSON.stringify(convoObject));
            }
            else{
                console.log('KEPT CONVO OBJECT');//+JSON.stringify(convoObject));
                messagesWithoutNaughtyNumbers.push(convoObject);
            }
        });
        return messagesWithoutNaughtyNumbers;
    },

    addToAllNumbersList(numbersList){
      this.setState({
         allNumbersList:this.state.allNumbersList.concat(numbersList),
      });
    },

    componentDidMount: function() {
        //what happens when the server says we have a new message
        socket.on('new message', this.handleNewMessage);
        //get all messages
        this.serverRequest = $.get('/api/messages', function (result) {
            window.alert("Got messages!");
            //get numbers we are never allowed to message ever again
            var naughtyNumbers = this.getNaughtyNumbersList(result);
            //get list of all numbers we have ever texted
            var _allNumbersList = this.getAllNumbersList(result);
            //get list of pertinent messages
            var cleanedMessages = this.removeMessagesWithNaughtyNumbers(result,naughtyNumbers);
            this.setState({
                messages: cleanedMessages,
                naughtyNumbersList:naughtyNumbers,
                allNumbersList:_allNumbersList
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    //what happens when a conversation in the inbox is clicked on
    viewConversation(recipient){
        this.setState({
            content:'chat',
            currentRecipient: recipient
        });
    },

    handlePageChange(event,index,value){
        //home was selected from the menu
        if (value===1){
            this.setState({
                content: 'home'
            });
        }
        //inbox was selected from the menu
        if (value===2){
            this.setState({
                content:'inbox'
            });
        }
    },

    render: function() {
        var content;
        if (this.state.content==='home'){
            content = <Home allNumbersList={this.state.allNumbersList} addToAllNumbersList={this.addToAllNumbersList}/>
        }
        if (this.state.content==='inbox'){
            content = <Inbox messages={this.state.messages} viewConversation={this.viewConversation}/>
        }
        if (this.state.content==='chat'){
            content = <Chat messages={this.state.messages} recipient={this.state.currentRecipient}/>
        }
        return (
            <MuiThemeProvider muiTheme={muiTheme}>
                <div>
                    <StickyContainer>
                        <Sticky>
                            <Toolbar>
                                <ToolbarGroup firstChild={true}>
                                    <DropDownMenu value={this.state.value} onChange={this.handlePageChange}>
                                        <MenuItem value={1} primaryText="Home" />
                                        <MenuItem value={2} primaryText="Inbox" />
                                    </DropDownMenu>
                                </ToolbarGroup>
                                <ToolbarGroup>
                                    <RaisedButton label="Logout" secondary={true} href="/logout"/>
                                </ToolbarGroup>
                            </Toolbar>
                        </Sticky>
                        {content}
                    </StickyContainer>
                </div>
            </MuiThemeProvider>
        );
    }
});

/*
 Home: Allows you to send mass messages
 */
var Home = React.createClass({
    render(){
        return (
            <HomeGUI allNumbersList={this.props.allNumbersList} addToAllNumbersList={this.props.addToAllNumbersList}/>
        );
    }
});

/*
 Inbox: Shows the recent activity on this
 accounts sms messages
 */
var Inbox = React.createClass({
    render(){
        return (
            <InboxTable viewConversation={this.props.viewConversation} messages={this.props.messages}/>
        );
    }
});

/*
 Chat: Displays a conversation. Gives user
 ability to send more messages to a recipient
 */
var Chat = React.createClass({

    render(){
        return(
            <Conversation messages={this.props.messages} recipient={this.props.recipient}/>
        )
    }
});

export {LoginPage, FourOhFourPage, HomePage};
