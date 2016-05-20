/*global config*/
import Reflux from 'reflux';
import InterProjectActions from '../actions/interProjectActions';
import InterProjectApi from '../data/InterProjectApi';

import BranchActions from '../actions/branchActions';

const InterProjectStore = Reflux.createStore({

  listenables: InterProjectActions,

  init() {},

  onTriggerInterProjectBuild(params, state) {
    const {selectedModules, buildDownstreamModules, resetCache} = state;
    InterProjectApi.triggerInterProjectBuild(selectedModules, resetCache, (error, resp) => {
      if (error) {
        this.error = error;
        return this.triggerErrorUpdate();
      }

      BranchActions.loadBranchBuildHistory(params);
    });
  }
});

export default InterProjectStore;