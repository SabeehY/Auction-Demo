import React from 'react';

export default class Admin extends React.Component {
  static propTypes = {
    bids: React.PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>Admin Page</div>
    );
  }
}
