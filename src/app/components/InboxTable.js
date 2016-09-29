/**
 * Created by Neil on 9/26/2016.
 */
import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
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
        console.log('Inbox table thinks that the messages are: ');
        console.log(messages);
        messages.forEach(function(recipientObject){
          inbox.push({
              recipient: recipientObject.recipient,
              message: recipientObject.messages[0].body,
              date: recipientObject.messages[0].dateSent
          })
      });
        console.log('The inbox looks like: ');
        console.log(inbox);
        return inbox;
    },
    getInitialState() {
        return {
            selectedRows: [],
            inbox: this.createInbox()
        };
    },
    _onRowSelection(selectedRow){
        this.props.viewConversation(selectedRow.phoneNumber);
    },

   render(){
       return(
           <div>
               <div style={styles.tableContainer}>
                   <h1>Inbox</h1>
                   <Table height="250px" multiSelectable={false} onRowSelection={this._onRowSelection}>
                       <TableHeader displaySelectAll={false}>
                           <TableRow>
                               <TableHeaderColumn>Phone Number</TableHeaderColumn>
                               <TableHeaderColumn>Message</TableHeaderColumn>
                               <TableHeaderColumn>Time</TableHeaderColumn>
                           </TableRow>
                       </TableHeader>
                       <TableBody displayRowCheckbox={false}>
                           {this.state.inbox.map((row, index) => (
                               <TableRow key={index} selected={this.state.selectedRows.indexOf(index) !== -1}>
                                   <TableRowColumn>{row.recipient}</TableRowColumn>
                                   <TableRowColumn>{row.message}</TableRowColumn>
                                   <TableRowColumn>{row.date}</TableRowColumn>
                               </TableRow>
                           ))}
                       </TableBody>
                   </Table>
               </div>
           </div>
       )
   }
});
export default InboxTable;
