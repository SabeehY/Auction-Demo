import React from 'react';
import {reduxForm, propTypes} from 'redux-form';
import {Row, Col, Button} from 'react-bootstrap';

@reduxForm({
  form: 'bid',
  fields: ['amount'],
  initialValues: {amount: ''}
})
export default class BidForm extends React.Component {
  static propTypes = {
    deal: React.PropTypes.object.isRequired,
    ...propTypes,
  };

  constructor(props) {
    super(props);
    this.state = {
      submitted: false
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.submitting && !(nextProps.submitting && nextProps.submitFailed)) {
      this.props.untouchAll();
      this.setState({
        submitted: true
      });
    }
  }

  render() {
    const {fields: {amount}, deal} = this.props;
    console.log('props', this.props);
    return (
      <form>
        <Row className="form-group">
          <Col sm={1}> Deal {deal.id}</Col>
          <Col sm={3}>
            <input {...amount}
              onChange={(ev, value) => {
                this.setState({ submitted: false });
                amount.onChange(ev, value);
              }}
              type="number"
              className="form-control"
              placeholder="Enter your bid"/>
          </Col>
          <Col sm={2}>
            { this.state.submitted && !amount.touched && 'Your bid has been submitted' ||
              <Button type="submit" onClick={this.props.handleSubmit} bsStyle="primary">Submit</Button>
            }
          </Col>
        </Row>
      </form>
    );
  }
}
