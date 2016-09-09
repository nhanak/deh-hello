/**
 * Created by Neil on 9/9/2016.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
/*
 LoginForm
 */
var LoginForm = React.createClass({
    getInitialState: function() {
        return {logged_in: false}
    },
    render: function(){
        return (
            <div class="login-form">
            <h1>Login</h1>
            <form>
            <p><input type='text' className='username' placeholder="Username"/></p>
            <p><input type='password' className='password' placeholder="Password"/></p>
            </form>
            <RaisedButton
        label="Login"
        secondary={true}
        onTouchTap={this.props.submit}
        />
        </div>
        );
    }
});

export default LoginForm