import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

import {Grid, Row, Col} from 'react-bootstrap';

import {BidForm} from 'components';
import {load, bid} from 'redux/modules/deal';

@asyncConnect([{
  promise: ({store}) => store.dispatch(load())
}])
@connect(state => ({ user: state.auth.user, deals: state.deal.deals }), {push, bid})
export default class Deals extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    deals: React.PropTypes.array,
    bid: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.user) this.props.push('/login');
  }

  render() {
    const {deals} = this.props;
    console.log('deals', deals);
    return (
      <Grid>
        <Row>
          <Col xs={12}>
          {
            deals &&
            deals.length > 0 &&
            deals.map(deal => (
              <BidForm
                 key={deal.id}
                 deal={deal}
                 formKey={String(deal.id)}
                 onSubmit={data => this.props.bid(deal.id, data)}
              />
            ))
          }
          </Col>
        </Row>
      </Grid>
    );
  }
}
