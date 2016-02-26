import React, {Component, PropTypes} from 'react';
import {bindAll} from 'underscore';
import SearchFilter from '../shared/SearchFilter.jsx';
import SidebarToggle from './SidebarToggle.jsx';

class SidebarFilter extends Component {

  constructor(props) {
    super(props);

    this.state = {
      inputValue: ''
    };

    bindAll(this, 'setInputValue', 'toggleFilter');
  }

  setInputValue(value) {
    this.props.updateResults(value);
  }

  toggleFilter(filter) {
    this.props.setToggleState(filter);
  }

  render() {
    if (this.props.loading) {
      return null;
    }

    return (
      <div>
        <div className='sidebar__filter-search'>
          <SearchFilter
            ref="buildFilterSearch"
            placeholder='Filter repositories...'
            onChange={this.setInputValue} />
        </div>
        <SidebarToggle
          toggleFilter={this.toggleFilter} 
          toggleFilterState={this.props.toggleFilterState} />
      </div>
    );

  }
}

SidebarFilter.propTypes = {
  updateResults: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
  filterText: PropTypes.string.isRequired,
  setToggleState: PropTypes.func.isRequired
};

export default SidebarFilter;
