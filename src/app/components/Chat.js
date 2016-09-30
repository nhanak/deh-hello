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
var messages = [{
    message:'How do I use this messaging app?How do I use this messaging app?How do I use this messaging app?How do I use this messaging app?How do I use this messaging app?How do I use this messaging app?',
    from: 'us',
    id:'1'
    },
    {
    message:'no idea',
    from: 'them',
        id:'2'
    },
    {
        message:'no idea',
        from: 'them',
        id:'3'
    },
    {
        message:'no idea',
        from: 'them',
        id:'4'
    },
    {
        message:'no idea',
        from: 'them',
        id:'5'
    },
    {
        message:'no idea',
        from: 'them',
        id:'6'
    },
    {
        message:'no idea',
        from: 'them',
        id:'7'
    },
    {
        message:'no idea',
        from: 'them',
        id:'8'
    },
    {
        message:'no idea',
        from: 'them',
        id:'9'
    },
    {
        message:'no idea',
        from: 'them',
        id:'10'
    },
    {
        message:'no idea',
        from: 'them',
        id:'11'
    },
    {
        message:'no idea',
        from: 'them',
        id:'12'
    },
    {
        message:'no idea',
        from: 'them',
        id:'13'
    },
    {
        message:'no idea',
        from: 'them',
        id:'14'
    },
    {
        message:'no idea',
        from: 'them',
        id:'15'
    },
    {
        message:'no idea',
        from: 'them',
        id:'16'
    },
    {
        message:'no idea',
        from: 'them',
        id:'17'
    }];

var Conversation = React.createClass({
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
    render(){
        return(
            <MuiThemeProvider muiTheme={muiTheme}>
                <ReactCSSTransitionGroup
                    transitionName="example"
                    transitionAppear={true}
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
            <div style={styles.centered}>
                <h1 style={styles.paddedTop}>Conversation with </h1>
                <div className="chat">
                    {this.props.messages.map((message) => (
                        <Message key={message.id} message={message.message} from={message.from}/>
                    ))}
                </div>
                <textarea rows="2" cols="36" placeholder="Enter message" onChange={this.handleMessageChange} value={this.state.message}/>
                <p></p>
                <RaisedButton label="Send" secondary={true} onTouchTap={this.sendMessage} />
            </div>
                </ReactCSSTransitionGroup>
                </MuiThemeProvider>
        )
    }
});
const MyAwesomeConversation = React.createClass({
    render(){
        return (
            <Conversation messages={messages} />
         )
    }
});
export default MyAwesomeConversation;

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