/*global config*/
import React, {Component, PropTypes} from 'react';
import SectionLoader from '../shared/SectionLoader.jsx';
import DashboardStarredModule from './DashboardStarredModule.jsx';

import PageHeader from '../shared/PageHeader.jsx';
import UIGrid from '../shared/grid/UIGrid.jsx';
import UIGridItem from '../shared/grid/UIGridItem.jsx';
import Headline from '../shared/headline/Headline.jsx';
import MutedMessage from '../shared/MutedMessage.jsx';
import Icon from '../shared/Icon.jsx';
import EmptyMessage from '../shared/EmptyMessage.jsx';
import Breadcrumb from '../shared/Breadcrumb.jsx';
import Helpers from '../ComponentHelpers';

class Dashboard extends Component {

  render() {
    if (this.props.loading) {
      return (
        <SectionLoader />
      );
    }

    let starredModuleTables = this.props.modulesBuildHistory.map((module) => {

      return (
        <DashboardStarredModule
          key={module.module.moduleId}
          modules={module.builds}
          moduleId={module.module.moduleId}
          moduleName={module.module.moduleName}
          modulePath={module.module.modulePath} />
      );
    });

    if (starredModuleTables.length === 0) {
      starredModuleTables = (
        <div>
          <p>You have no starred modules.</p>
          <p>
          ProTip: Starring modules allows you to quickly navigate to and view a modules build state from the sidebar, as well as view recent build history in the dashboard.
          <br />
          Star modules by clicking the 'All Tab' then clicking on the star icon next to the module.
          </p>
        </div>
      );
    }

    return (
      <div>
        <PageHeader>
          <Breadcrumb
            appRoot={config.appRoot}
            path={window.location.pathname}
          />
        </PageHeader>

        <UIGrid>
          <UIGridItem size={12}>
            <h4 className="dashboard__section-title"></h4>
            <Headline>
              <Icon for="star" classNames="headline-icon" />
              Starred Modules
            </Headline>
            {starredModuleTables}
          </UIGridItem>
        </UIGrid>

      </div>
    );
  }
}

Dashboard.propTypes = {
  loading: PropTypes.bool,
  modulesBuildHistory: PropTypes.array
};

export default Dashboard;
