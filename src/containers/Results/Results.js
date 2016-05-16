import React from 'react';
import {connect} from 'react-redux';
import { asyncConnect } from 'redux-async-connect';
import {Grid, Row, Col} from 'react-bootstrap';

import {load} from 'redux/modules/deal';

@asyncConnect([{
  promise: ({store}) => store.dispatch(load())
}])
@connect(state => ({ user: state.auth.user, deal: state.deal }))
export default class Results extends React.Component {
  static propTypes = {
    user: React.PropTypes.object.isRequired,
    deal: React.PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {user} = this.props;
    const deals = this.props.deal.deals;
    const winningDeals = Array.isArray(deals) && deals.map(deal => {
      const sortedBids = deal.bids.sort((a, b) => a.amount - b.amount); // eslint-disable-line
      if (sortedBids[0] && (sortedBids[0].bidder._id.toString() === user._id.toString())) {
        deal.isWon = true;
      } else { deal.isWon = false; }
      return deal;
    });
    console.log('winingDeals', winningDeals, 'deals', deals);
    return (
      <Grid>
          {
            winningDeals.map(deal => {
              return (
              <Row style={{ marginTop: 15 }}>
                <Col sm={3}>
                  <strong>Deal {deal.id}</strong>
                </Col>
                <Col sm={9}>
                  { deal.isWon &&
                    <span className="text-success"><strong>You have WON this deal</strong></span> ||
                    <span className="text-danger">You have not won this deal</span>
                  }
                </Col>
              </Row>
              );
            })
          }
      </Grid>
    );
  }
}
