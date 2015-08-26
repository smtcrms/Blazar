import React, {Component, PropTypes} from 'react';
import PageHeader from '../shared/PageHeader.jsx';
import Breadcrumb from '../shared/Breadcrumb.jsx';
import UIGrid from '../shared/grid/UIGrid.jsx';
import UIGridItem from '../shared/grid/UIGridItem.jsx';
import Headline from '../shared/headline/Headline.jsx';
import HeadlineDetail from '../shared/headline/HeadlineDetail.jsx';
import ModulesTable from './ModulesTable.jsx';
import SectionLoader from '../shared/SectionLoader.jsx';
import Icon from '../shared/Icon.jsx';

class Branch extends Component{

  render() {

    if (this.props.loading) {
      return (
        <SectionLoader />
      );
    }

    return (
      <div>
        <PageHeader>
          <Breadcrumb />
          <Headline>
            <Icon prefix="mega" type="octicon" name="git-branch" classNames="headline-icon" />
            <span>{this.props.params.branch}</span>
            <HeadlineDetail>
              Branch Modules
            </HeadlineDetail>
          </Headline>
        </PageHeader>
        <UIGrid>
          <UIGridItem size={12}>
            <ModulesTable
              modules={this.props.modules}
            />
          </UIGridItem>
        </UIGrid>
      </div>
    );
  }

}

Branch.propTypes = {
  params: PropTypes.object.isRequired,
  modules: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired
};

export default Branch;
