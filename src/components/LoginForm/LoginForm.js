import React from 'react';
import {reduxForm, propTypes} from 'redux-form';
import validation from './validation';

@reduxForm({
  form: 'login',
  fields: ['username', 'email', 'company', 'phone'],
  validate: validation,
})
export default class LoginForm extends React.Component {
  static propTypes = {
    ...propTypes
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {fields: {username, email, company, phone}} = this.props;
    return (
      <div>
        <form>
          <div className="form-group">
            <input type="text"
                   {...username}
                   placeholder="Enter your name"
                   className="form-control"/>
            <small>{username.error && username.touched && <div className="text-danger">{username.error}</div>}</small>
          </div>
          <div className="form-group">
            <input type="text"
                   {...company}
                   placeholder="Enter your company"
                   className="form-control"/>
            <small>{company.error && company.touched && <div className="text-danger">{company.error}</div>}</small>
          </div>
          <div className="form-group">
            <input type="tel"
                   {...phone}
                   placeholder="Enter your phone number"
                   className="form-control"/>
            <small>{phone.error && phone.touched && <div className="text-danger">{phone.error}</div>} Format: (123) 123-1234</small>
          </div>
          <div className="form-group">
            <input type="email"
                   {...email}
                   placeholder="Enter your email"
                   className="form-control"/>
            <small>{email.error && email.touched && <div className="text-danger">{email.error}</div>}</small>
          </div>
          <p>Enter your details, and press Start</p>
          <button className="btn btn-primary btn-lg" onClick={this.props.handleSubmit}> Start </button>
        </form>
      </div>
    );
  }
}
