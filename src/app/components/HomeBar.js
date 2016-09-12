/**
 * Created by Neil on 9/12/2016.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
/*
 HomeBar
 */
var HomeBar = React.createClass({
    getInitialState: function() {
        return {logged_in: false}
    },
    render: function(){
        return (
            <div>
                <h1>HomeBar</h1>
            </div>
        );
    }
});

export default HomeBar