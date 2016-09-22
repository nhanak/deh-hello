/**
 * Created by Neil on 9/20/2016.
 */
import React from 'react';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
const styles = {
    tableContainer: {
        width: 300,
        overflow: 'hidden',
        margin: '20px auto 0',
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

const RecipientsTable= React.createClass({
    getInitialState: function() {
        return {
            recipients: this.props.recipients,
            recipientNumber: "",
            selectedRows: [],
        };
    },

    handleRecipientNumberChange: function(evt) {
        this.setState({
            recipientNumber: evt.target.value
        });
    },

    resetRecipientNumber: function() {
        this.setState({
            recipientNumber: ""
        });
    },

    _onRowSelection:function(selectedRowz){
      this.setState({
          selectedRows: selectedRowz
      });
    },

    removeSelected:function(){
        //remove the element at the index, the following index must then be decreased by one*amount removed
        var amountRemoved = 0;
        for (var index in this.state.selectedRows){
            //console.log('The index is: '+index);
            this.props.removeRecipient(index,amountRemoved);
            amountRemoved += 1;
        }
    },
    render: function () {
        return(
        <div>
            <div style={styles.tableContainer}>
                <Table height="250px" multiSelectable={true} onRowSelection={this._onRowSelection}>
                    <TableHeader displaySelectAll={false}>
                        <TableRow>
                            <TableHeaderColumn>Phone Number</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {this.props.recipients.map( (row, index) => (
                            <TableRow key={index} selected={this.state.selectedRows.indexOf(index) !== -1}>
                                <TableRowColumn>{row}</TableRowColumn>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                </div>
                <input value={this.state.recipientNumber} type="text" name="phone_number" placeholder="Recipients phone number" style={styles.recipientsNumberContainer} onChange={this.handleRecipientNumberChange}/>
            <div style={styles.buttonContainer}>
                <RaisedButton label="Add" primary={true} type="submit" value="Send" style={styles.buttonSpacer}  onTouchTap={() =>{this.props.addRecipient(this.state.recipientNumber,this.resetRecipientNumber)}}/>
                <RaisedButton label="Remove Selected" secondary={true} onTouchTap={this.removeSelected}/>
            </div>
        </div>
        )
    }
    });


export default RecipientsTable;