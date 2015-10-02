import React, {Component, PropTypes} from 'react';
import $ from 'jquery';
import LazyRender from '../shared/LazyRender.jsx';
import SidebarFilter from './SidebarFilter.jsx';

import {bindAll, contains, has, contains} from 'underscore';
import {markStarredModules} from '../../utils/starHelpers';
import {getFilterMatches, filterByToggle} from '../../utils/buildsHelpers';
import {FILTER_MESSAGES, NO_MATCH_MESSAGES} from '../constants';

import SectionLoader from '../shared/SectionLoader.jsx';
import MutedMessage from '../shared/MutedMessage.jsx';
import SidebarItem from '../sidebar/SidebarItem.jsx';

let Link = require('react-router').Link;

class BuildsSidebar extends Component {

  constructor() {
    bindAll(this, 'updateResults', 'setToggleState', 'toggleStar');

    this.state = {
      filterText: '',
      toggleFilterState: 'starred'
    };
  }

  updateResults(input) {
    this.setState({
      filterText: input
    });
  }

  setToggleState(toggleState) {
    const filterText = this.state.filterText;

    this.setState({
      filterText: filterText,
      toggleFilterState: toggleState
    });

  }

  toggleStar(isStarred, moduleInfo) {
    this.props.persistStarChange(isStarred, moduleInfo)
  }

  buildModuleComponents(modules) {
    return modules.map( (module) => {
      if (has(module, 'module')){
        return (
          <SidebarItem 
            key={module.module.id}
            build={module} 
            isStarred={module.module.isStarred}
            toggleStar={this.toggleStar} 
            persistStarChange={this.props.persistStarChange} 
          />
        )
      }
    });
  }

  render() {
    const matches = getFilterMatches(this.props.builds, this.state.filterText);
    const markStarred = markStarredModules(matches, this.props.stars);
    const filteredByToggle = filterByToggle(this.state.toggleFilterState, markStarred, this.props.stars)
    const moduleComponents = this.buildModuleComponents(filteredByToggle);
    const searchType = NO_MATCH_MESSAGES[this.state.toggleFilterState];
    let sidebarMessage;

    if (this.props.loading) {
      return (
        <SectionLoader roomy={true} />
      );
    }

    if (moduleComponents.length === 0 && this.state.filterText.length > 0) {
      sidebarMessage = (
        <MutedMessage roomy={true}>
          No {searchType} modules matching <strong>{this.state.filterText}</strong>.
        </MutedMessage>
      )
    }

    if (moduleComponents.length === 0 && this.state.filterText.length === 0) {
      let message;
      if (this.state.toggleFilterState === 'starred') {
        message = 'No modules have been starred';
      } else if (this.state.toggleFilterState === 'building') {
        message = 'No modules actively building';
      }
      sidebarMessage = (
        <MutedMessage roomy={true}>
          {message}
        </MutedMessage>
      )
    } 

    const headerHeight = $('#primary-nav').height() + $('.sidebar__filter').height();
    const containerHeight = $(window).height() - headerHeight;

    return (
      <div>
        <div className="sidebar__filter">
          <SidebarFilter
            loading={this.props.loading}
            builds={this.props.builds}
            filterText={this.state.filterText}
            updateResults={this.updateResults}
            setToggleState={this.setToggleState}
            toggleFilterState={this.state.toggleFilterState}
          />
        </div>

        <div className='sidebar__list'>
          <LazyRender childHeight={71} maxHeight={containerHeight}>
            {moduleComponents}
          </LazyRender>
          {sidebarMessage}
        </div>

      </div>
    );
  }
}


BuildsSidebar.propTypes = {
  loading: PropTypes.bool.isRequired,
  builds: PropTypes.array.isRequired,
  stars: PropTypes.array.isRequired,
  persistStarChange: PropTypes.func.isRequired
};

export default BuildsSidebar;
