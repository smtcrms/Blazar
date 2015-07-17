import React from 'react';
import PageHeader from '../shared/PageHeader.jsx';
import Breadcrumb from '../shared/Breadcrumb.jsx';
import UIGrid from '../shared/grid/UIGrid.jsx';
import UIGridItem from '../shared/grid/UIGridItem.jsx';
import BuildDetail from '../shared/BuildDetail.jsx';
import Log from './log.jsx';
import PageHeadline from '../shared/PageHeadline.jsx';

class Build extends React.Component{

  render() {
    // TO DO: show page loader
    if (this.props.loading) {
      return  <div></div>;
    }

    let {module, buildState} = this.props.build;
    let subheadline = `Build #${buildState.buildNumber}`;

    return (
      <div>
        <PageHeader>
          <Breadcrumb />
          <PageHeadline headline={module.name} subheadline={subheadline} />
        </PageHeader>
        <UIGrid>
          <UIGridItem size={12}>
            <BuildDetail
              build={this.props.build}
              loading={this.props.loading}
            />
          </UIGridItem>
          <UIGridItem size={12}>
            <Log />
          </UIGridItem>
        </UIGrid>
      </div>
    );
  }

}

Build.propTypes = {
  build: React.PropTypes.shape({
    buildState: React.PropTypes.object,
    gitInfo: React.PropTypes.object,
    module: React.PropTypes.object
  }),
  params: React.PropTypes.object,
  loading: React.PropTypes.bool
};

export default Build;
