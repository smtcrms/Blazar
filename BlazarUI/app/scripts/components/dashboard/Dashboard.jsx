import React, {Component, PropTypes} from 'react';
import SectionLoader from '../shared/SectionLoader.jsx';
import StarredProvider from '../StarredProvider';
import DashboardStarredRepo from './DashboardStarredRepo.jsx';
import Icon from '../shared/Icon.jsx';

class Dashboard extends Component {

  render() {
    if (this.props.loading) {
      return (
        <SectionLoader />
      );
    }

    let starredRepos = [];
    if (this.props.builds) {
      this.props.builds.grouped.forEach(function(repo) {
        if(StarredProvider.hasStar({ repo: repo.repository, branch: repo.branch }) !== -1) {
          starredRepos.push(
            <DashboardStarredRepo repo={repo}></DashboardStarredRepo>
          );
        }
      });
    }

    return (
      <div className="primary-content">
        <h2 className="header-primary">
          <Icon name="tachometer" classNames="headline-icon"></Icon>
          Dashboard
        </h2>
        {starredRepos}
      </div>
    );
  }
}

Dashboard.propTypes = {
  loading: PropTypes.bool,
  builds: PropTypes.object
};

export default Dashboard;
