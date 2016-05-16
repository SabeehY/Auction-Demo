import React from 'react';
import {connect} from 'react-redux';
import {asyncConnect} from 'redux-async-connect';
import {Grid, Row, Col} from 'react-bootstrap';

import {load} from 'redux/modules/deal';

@asyncConnect([{
  promise: ({store}) => store.dispatch(load())
}])
@connect(state => ({ deals: state.deal.deals }))
export default class Admin extends React.Component {
  static propTypes = {
    deals: React.PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      deals: this.props.deals
    };
  }

  componentDidMount() {
    if (socket) {
      socket.on('newBid', this.onBidRecieved);
    }
  }

  componentWillUnmount() {
    if (socket) {
      socket.removeListener('newBid', this.onBidRecieved);
    }
  }

  onBidRecieved = (data) => {
    this.setState({
      deals: data
    });
  }

  render() {
    const {deals} = this.state;
    return (
      <Grid>
        {
          deals &&
          deals.map(deal => {
            return (
              <div style={{ marginTop: 10 }} key={deal._id}>
                <Row>
                  <Col sm={4}>
                    <strong>Deal ID:</strong> {deal.id}
                  </Col>
                  <Col sm={4}>
                    <strong>Bids: </strong> {
                       deal.bids &&
                       deal.bids.length > 0 &&
                       deal.bids.map(bid => <div key={bid._id} style={{ marginBottom: 10 }}> Company: {bid.bidder.company} <br/> Amount: ${bid.amount}</div>) ||
                       <span className="text-muted">No bids</span>
                    }
                  </Col>
                </Row>
              </div>
            );
          })
        }
      </Grid>
    );
  }
}
