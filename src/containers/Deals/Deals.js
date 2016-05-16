import React from 'react';
import { push } from 'react-router-redux';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-async-connect';

import {Grid, Row, Col} from 'react-bootstrap';

import Timer from './Timer';
import {BidForm} from 'components';
import {load, bid} from 'redux/modules/deal';

@asyncConnect([{
  promise: ({store}) => store.dispatch(load())
}])
@connect(
  state => ({ user: state.auth.user, timeEnd: state.auth.timeEnd, deal: state.deal }),
  {push, bid})
export default class Deals extends React.Component {
  static propTypes = {
    user: React.PropTypes.object,
    timeEnd: React.PropTypes.number,
    deal: React.PropTypes.object,
    bid: React.PropTypes.func.isRequired,
    push: React.PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (!this.props.user) this.props.push('/login');
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.deal.submitting && nextProps.deal.submitted) {
      console.log('BID UPDATED');
      // Bids updated
      if (socket) {
        const newDeals = nextProps.deal.deals;
        console.log('emiiting new deals', newDeals);
        socket.emit('bid', newDeals);
      }
    }
  }

  onTimerComplete = () => this.props.push('/results')

  render() {
    const deals = this.props.deal.deals;
    const remainingTime = (this.props.user.timeEnd || Date.now()) - Date.now();
    console.log('userTime', this.props.user.timeEnd, 'now Time', Date.now(), 'remaining time', remainingTime);
    return (
      <Grid>
        <Row>
          <Col xs={9} style={{marginTop: 30}}>
          {
            deals &&
            deals.length > 0 &&
            deals.map(deal => (
              <BidForm
                 key={deal.id}
                 deal={deal}
                 initialValues={{amount: deal.userBid && deal.userBid.amount}}
                 hasValue={deal.userBid && deal.userBid.amount && true || false }
                 formKey={String(deal.id)}
                 onSubmit={data => this.props.bid(deal.id, data)}
              />
            ))
          }
          </Col>
          <Col xs={3} style={{marginTop: 30, color: 'red', fontWeight: 'bold'}}>
            <h4>Time Remaining:</h4>
            <Timer initialTimeRemaining={remainingTime}
                   completeCallback={this.onTimerComplete} />

          </Col>

        </Row>
      </Grid>
    );
  }
}
