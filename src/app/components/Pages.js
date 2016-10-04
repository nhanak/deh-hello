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
import RecipientsTable from './RecipientsTable';
import InboxTable from './InboxTable';
import Conversation from './Chat'
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
            content: <Home/>,
            messages: []
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
                messages: newMessages
            });
        }
        else{
            this.setState({
                messages:this.addMessageToConversation(newConversation)
            });
        }
    },

    componentDidMount: function() {
        socket.on('new message', this.handleNewMessage);
        this.serverRequest = $.get('/api/messages', function (result) {
            this.setState({
                messages:result
            });
        }.bind(this));
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
    },

    //what happens when a conversation in the inbox is clicked on
    viewConversation(recipient){
        var findRecipientMessages = function(convoObject){
            if (convoObject.recipient===recipient){
                return convoObject.messages;
            }
        }
        var recipientMessagesRaw = this.state.messages.filter(findRecipientMessages);
        var recipientMessages = recipientMessagesRaw[0].messages;
        this.setState({
            content:<Chat recipientMessages={recipientMessages} recipient={recipient}/>
        });
    },

    handlePageChange(event,index,value){
        //home was selected from the menu
        if (value===1){
            this.setState({
                content: <Home/>
            });
        }
        //inbox was selected from the menu
        if (value===2){
            this.setState({
                content: <Inbox messages={this.state.messages} viewConversation={this.viewConversation}/>
            });
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
                        {this.state.content}
                    </StickyContainer>
                </div>
            </MuiThemeProvider>
        );
    }
});

/*
    Home: owns RecipientTable. As such, it controls
    the props of RecipientTable. Basically, RecipientTable gathers
    the required data and Home stores it in its own state, which
    the RecipientTable can see through its props
 */
var Home = React.createClass({
    getInitialState () {
        return {
            recipients:[],
            message:'',
        };
    },

    getDefaultProps() {
        return {
            handleChange: (event, index, value) => this.setState({value}),
        }
    },

    addRecipient(recipientNumber,resetRecipientNumber){
        if (recipientNumber.match(/^[+][0-9]+$/)!=null) {
            this.setState({
                recipients: this.state.recipients.concat(recipientNumber)
            });
            resetRecipientNumber();
        }
    },

    removeRecipient(index,amountRemoved){
        this.state.recipients.splice(index-amountRemoved,1);
    },

    handleMessageChange(evt){
        this.setState({
            message: evt.target.value
        });
    },

    sendMessage(){
        if (this.state.message.length!==0){
            if(this.state.recipients.length!==0) {
                var twilioMessage={
                    message: this.state.message,
                    recipients:this.state.recipients
                };
                jQuery.post('/api/messages',twilioMessage);
                alert('Message succesfully sent!');
                this.setState({
                    recipients: [],
                    message: ''
                })
            }
        }
    },
   render(){
       return(
           <div>
               <ReactCSSTransitionGroup
                   transitionName="example"
                   transitionAppear={true}
                   transitionEnterTimeout={500}
                   transitionLeaveTimeout={300}
                   transitionAppearTimeout={500}>
                   <div style={styles.recipientsContainer}>
                       <h1>Recipients</h1>
                       <RecipientsTable messageSent={this.state.messageSent} recipients={this.state.recipients} addRecipient={this.addRecipient} removeRecipient={this.removeRecipient}/>
                   </div>
                   <div style={styles.messageContainer}>
                       <h1 style={styles.headerPadding}>Message</h1>
                       <textarea rows="10" cols="50" placeholder="Enter message" onChange={this.handleMessageChange} value={this.state.message}/>
                       <p></p>
                       <RaisedButton label="Send" secondary={true} onTouchTap={this.sendMessage} />
                   </div>
               </ReactCSSTransitionGroup>
           </div>
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
           <Conversation messages={this.props.recipientMessages} recipient={this.props.recipient}/>
       )
   }
});

export {LoginPage, FourOhFourPage, HomePage};