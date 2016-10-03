/**
 * Created by Neil on 9/29/2016.
 */
import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import darkBaseTheme from '../../../node_modules/material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from '../../../node_modules/material-ui/styles/getMuiTheme';
import MuiThemeProvider from '../../../node_modules/material-ui/styles/MuiThemeProvider';
const muiTheme = getMuiTheme(darkBaseTheme);
//import Conversation from 'chat-template/dist/Conversation';
//right is us, left is other person
const styles = {
    centered: {
    textAlign: 'center',
    },
    paddedTop:{
        paddingTop: 20
    }};

const Conversation = React.createClass({
    getInitialState(){
      return{
          message: ''
      }
    },

    handleMessageChange(evt){
        this.setState({
            message: evt.target.value
        });
    },

    sendMessage(){
        if (this.state.message.length!==0){
            var twilioMessage={
                message: this.state.message,
                recipients:[this.props.recipient]
            };
            jQuery.post('/api/messages',twilioMessage);
            alert('Message succesfully sent to: '+this.props.recipient+"!");
            this.setState({
                message: ''
            })
        }
    },

    render(){
        return(
            <MuiThemeProvider muiTheme={muiTheme}>
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}
                    transitionAppearTimeout={500}>
            <div style={styles.centered}>
                <h1 style={styles.paddedTop}>Conversation with {this.props.recipient} </h1>
                <div className="chat">
                    {this.props.messages.map((message) => (
                        <Message key={message.date} message={message.body} from={message.from}/>
                    ))}
                </div>
                <textarea rows="1" cols="42" placeholder="Enter message" onChange={this.handleMessageChange} value={this.state.message}/>
                <p></p>
                <RaisedButton label="Send" secondary={true} onTouchTap={this.sendMessage} />
            </div>
                </ReactCSSTransitionGroup>
                </MuiThemeProvider>
        )
    }
});

var Message = React.createClass({
    getMeOrYou(){
        var bubbleYou="bubble you";
        var bubbleMe="bubble me";
      if (this.props.from==='them'){
          return bubbleMe
      }
    else{
          return bubbleYou
      }
    },
    getInitialState () {
        var meOrYouz=this.getMeOrYou();
        return {
            meOrYou:meOrYouz
        };
    },
   render(){
       return(
            <div className={this.state.meOrYou}>{this.props.message}</div>
       )
   }
});

export default Conversation