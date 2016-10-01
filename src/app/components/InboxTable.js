/**
 * Created by Neil on 9/26/2016.
 */
import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const styles = {
    tableContainer: {
        width: 800,
        overflow: 'hidden',
        margin: '20px auto 0',
        textAlign: 'center'
    },
    buttonContainer: {
        margin:'10px 0 0 0',
    },
    recipientsNumberContainer:{
        margin:'10px 0 0 0',
        height:1,
        width:265,
    },
    buttonSpacer:{
        margin:'0 10px 0 0',
    },
    propToggleHeader: {
        margin: '20px auto 10px',
    },
};

const InboxTable = React.createClass({
    createInbox(){
        var inbox = [];
        var messages = this.props.messages;
        messages.forEach(function(recipientObject){
          inbox.push({
              recipient: recipientObject.recipient,
              message: recipientObject.messages[0].body,
              date: recipientObject.messages[0].date
          })
      });
        return inbox;
    },
    getInitialState() {
        return {
            selectedRows: [],
            inbox: this.createInbox()
        };
    },
    getRecipient(rowNumber, columnID){
        var row = this.state.inbox[rowNumber];
        this.props.viewConversation(row.recipient);
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
                   <div style={styles.tableContainer}>
                       <h1>Inbox</h1>
                       <Table height="250px" multiSelectable={false} onCellClick={this.getRecipient}>
                           <TableHeader displaySelectAll={false}>
                               <TableRow>
                                   <TableHeaderColumn>Phone Number</TableHeaderColumn>
                                   <TableHeaderColumn>Message</TableHeaderColumn>
                                   <TableHeaderColumn>Time</TableHeaderColumn>
                               </TableRow>
                           </TableHeader>
                           <TableBody displayRowCheckbox={false} showRowHover={true}>
                               {this.state.inbox.map((row, index) => (
                                   <TableRow key={index}>
                                       <TableRowColumn>{row.recipient}</TableRowColumn>
                                       <TableRowColumn>{row.message}</TableRowColumn>
                                       <TableRowColumn>{row.date}</TableRowColumn>
                                   </TableRow>
                               ))}
                           </TableBody>
                       </Table>
                   </div>
               </ReactCSSTransitionGroup>
           </div>
       )
   }
});
export default InboxTable;
