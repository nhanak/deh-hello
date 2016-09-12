/**
 * Created by Neil on 9/12/2016.
 */
import { setLoginStatus, LoginStatus } from '../actions'
import { connect } from 'react-redux'
import LoginForm from '../components/LoginForm'

const mapDispatchToProps = (dispatch) => {
    return {
        submit: () => {
            dispatch(setLoginStatus(LoginStatus.LOGGED_IN));
        }
    }
}

var mapStateToProps = function(state){
    // This component will have access to `state.loginStatus` through `this.props.LOGIN_STATUS`
    return {LOGIN_STATUS:state.loginStatus};
};

const VisibleHomeBar = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm);

export default VisibleHomeBar