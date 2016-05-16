import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';

import * as authActions from 'redux/modules/auth';
import {LoginForm} from 'components';

@connect(
  state => ({user: state.auth.user}),
  {...authActions, pushState: push})
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func
  }

  componentDidMount() {
    if (this.props.user) this.props.pushState('/deals');
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const input = this.refs.username;
    this.props.login(input.value);
    input.value = '';
  }


  render() {
    const {user, logout} = this.props;
    const styles = require('./Login.scss');
    return (
      <div className={styles.loginPage + ' container'}>
        <Helmet title="Login"/>
        <h1>Login</h1>
        {!user && <LoginForm onSubmit={this.props.login} />}
        {user &&
        <div>
          <p>You are currently logged in as {user.username}.</p>
          <div>
            <button className="btn btn-danger" onClick={logout}><i className="fa fa-sign-out"/>{' '}Log Out</button>
          </div>
        </div>
        }
      </div>
    );
  }
}
