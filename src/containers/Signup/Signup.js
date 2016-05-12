import React from 'react';
import {Grid, Row, Col} from 'react-bootstrap';

export default class Signup extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h4>Signup</h4>
          </Col>
        </Row>
      </Grid>
    );
  }
}
