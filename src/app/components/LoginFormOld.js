/**
 * Created by Neil on 9/13/2016.
 */
import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ReactStormpath from 'react-stormpath'
/*
 LoginFormOld
 */
var LoginFormOld = React.createClass({
    getInitialState: function() {
        return {username: '', password: ''}
    },
    handleUsernameChange: function(e) {
        this.setState({username: e.target.value});
    },
    handlePasswordChange: function(e) {
        this.setState({password: e.target.value});
    },
    handleSubmit: function(e){
        this.props.submit(this.state.username,this.state.password)
    },
    render: function(){
        return (
            <div>
                <h1>Login</h1>
                <form>
                    <p><input type='text' name='username' placeholder="Username" onChange={this.handleUsernameChange}/></p>
                    <p><input type='password' name='password' placeholder="Password" onChange={this.handlePasswordChange}/></p>
                </form>
                <RaisedButton
                    label="Login"
                    secondary={true}
                    onTouchTap={this.handleSubmit}
                />
            </div>
        );
    }
});

export default LoginFormOld