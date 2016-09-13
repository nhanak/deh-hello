/**
 * Created by Neil on 9/13/2016.
 */
import { setLoginStatus, LoginStatus } from '../actions'
import { connect } from 'react-redux'
import LoginFormOld from '../components/LoginFormOld'

var success = () =>{
    console.log('Login was succesful');
    dispatch(setLoginStatus(LoginStatus.LOGGED_IN));
};

const mapDispatchToProps = (dispatch) => {
    return {
        submit: (username,password) => {
            var credentials = {
                "username": username,
                "password": password
            };
            console.log('Should be sending ajax request...');
            jQuery.post('/api/login',JSON.stringify(credentials),success,"application/json");
        }
    }
}

var mapStateToProps = function(state){
    // This component will have access to `state.loginStatus` through `this.props.LOGIN_STATUS`
    return {LOGIN_STATUS:state.loginStatus};
};

const VisibleLoginFormOld = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginFormOld);

export default VisibleLoginFormOld