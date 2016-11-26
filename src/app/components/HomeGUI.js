/**
 * Created by Neil on 11/26/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import darkBaseTheme from '../../../node_modules/material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import MuiThemeProvider from '../../../node_modules/material-ui/styles/MuiThemeProvider';
import RecipientsTable from './RecipientsTable';
const muiTheme = getMuiTheme(darkBaseTheme);
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
 Home: owns RecipientTable. As such, it controls
 the props of RecipientTable. Basically, RecipientTable gathers
 the required data and Home stores it in its own state, which
 the RecipientTable can see through its props
 */
const HomeGUI = React.createClass({
    getInitialState () {
        return {
            recipients:[],
            message:'',
        };
    },

    addRecipient(recipientNumber,resetRecipientNumber){

        var number = recipientNumber.match(/\d/g);
        number = number.join("");
        if (number.length===11||number.length===10) {
            var finalNumber;
            if (number.length===11){
                finalNumber='+'+number;
            }
            else{
                finalNumber='+1'+number;
            }
            this.setState({
                recipients: this.state.recipients.concat(finalNumber)
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

    sendMassMessage(){
        var allNumbers=this.props.allNumbersList;
        if (this.state.message.length!==0){
            if(this.state.recipients.length!==0) {
                if(this.props.allNumbersList.length!==0) {
                    //we never want to MASS text people we have messaged before
                    var actualRecipients = [];
                    var badRecipients = [];
                    this.state.recipients.forEach(function(newNumber) {
                        if (allNumbers.indexOf(newNumber) >= 0) {
                            badRecipients.push(newNumber);
                        }
                        else{
                            actualRecipients.push(newNumber);
                        }
                    });
                    if (badRecipients.length>0){
                        alert("The following numbers have been mass texted before and so will not be mass texted now: "+badRecipients);
                    }
                    //send the message to the actual recipeints
                    if (actualRecipients.length>0){
                        var twilioMessage = {
                            message: this.state.message,
                            recipients: actualRecipients
                        };
                        jQuery.post('/api/messages', twilioMessage);
                        alert('Message(s) succesfully sent!');
                        this.props.addToAllNumbersList(actualRecipients);
                        this.setState({
                            recipients: [],
                            message: '',
                        })
                    }
                }
                else{
                    alert("Please wait until server has fetched messages before sending mass text");
                }
            }
        }
    },
    render(){
        return(
            <div>
                <MuiThemeProvider muiTheme={muiTheme}>
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
                            <RaisedButton label="Send" secondary={true} onTouchTap={this.sendMassMessage} />
                        </div>
                    </ReactCSSTransitionGroup>
                </MuiThemeProvider>
            </div>
        );

    }
});

export default HomeGUI;