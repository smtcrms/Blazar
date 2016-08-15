import React, {Component, PropTypes} from 'react';
import {Button} from 'react-bootstrap';

class BuildButton extends Component {

  render() {
    if (this.props.loading) {
      return null;
    }

    return (
      <Button
        id="build-now-button"
        bsStyle="primary"
        onClick={this.props.openModuleModal}
        style={{'marginRight': '5px'}}
      >
        Build Now
      </Button>
    );
  }
}

BuildButton.propTypes = {
  openModuleModal: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired
};

export default BuildButton;
