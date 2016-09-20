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
    render: function () {
        return(
        <div>
            <div style={styles.tableContainer}>
                <Table height="250" multiSelectable={true}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Phone Number</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>
                        <TableRow>
                            <TableRowColumn>7804734910</TableRowColumn>
                        </TableRow>

                    </TableBody>
                </Table>
            </div>
                <input type="text" name="phone_number" placeholder="Recipients phone number" style={styles.recipientsNumberContainer} />
            <div style={styles.buttonContainer}>
                <RaisedButton label="Add" primary={true} type="submit" value="Send" style={styles.buttonSpacer} />
                <RaisedButton label="Remove Selected" secondary={true} type="submit" value="Remove"
                              onClick={this.removeSelectedRows}/>
            </div>
        </div>
        )
    }
    });


export default RecipientsTable;