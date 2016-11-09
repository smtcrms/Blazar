import Reflux from 'reflux';

import RepoBuildActions from '../actions/repoBuildActions';
import RepoBuildApi from '../data/RepoBuildApi';

import { buildIsInactive } from '../components/Helpers';

const RepoBuildStore = Reflux.createStore({

  listenables: RepoBuildActions,

  init() {
    this.repoBuild = {};
    this.moduleBuilds = [];
    this.shouldPoll = true;
    this.moduleBuildsList = [];
    this.isRequestingRepoBuild = false;
    this.isRequestingModuleBuilds = false;
  },

  onLoadRepoBuild(params) {
    this.params = params;

    if (this.isRequestingRepoBuild) {
      return;
    }

    this.isRequestingRepoBuild = true;

    RepoBuildApi.fetchRepoBuild(params)
      .then((resp) => {
        this.repoBuild = resp;
        this.isRequestingRepoBuild = false;

        if (buildIsInactive(this.repoBuild.state)) {
          this.shouldPoll = false;
        }

        this.trigger({
          currentRepoBuild: this.repoBuild,
          loadingRepoBuild: false
        });
      }, (error) => {
        this.isRequestingRepoBuild = false;
        this.shouldPoll = false;
        this.trigger({
          error,
          loadingRepoBuild: false
        });
      });
  },

  onLoadRepoBuildById(repoBuildId) {
    RepoBuildApi.fetchRepoBuildById(repoBuildId)
      .then((resp) => {
        this.trigger({
          repoBuild: resp,
          loading: false
        });
      });
  },

  onLoadModuleBuilds(params) {
    this.params = params;

    if (this.isRequestingModuleBuilds) {
      return;
    }

    this.isRequestingModuleBuilds = true;
    RepoBuildApi.fetchModuleBuilds(params)
      .then((resp) => {
        this.moduleBuilds = resp;
        this.isRequestingModuleBuilds = false;

        this.trigger({
          moduleBuilds: this.moduleBuilds,
          loadingModuleBuilds: false
        });
      }, (error) => {
        this.isRequestingModuleBuilds = false;
        this.trigger({
          error,
          loadingModuleBuilds: false
        });
      });
  },

  onLoadModuleBuildsById(branchId, repoBuildId, buildNumber) {
    RepoBuildApi.fetchModuleBuildsById(branchId, repoBuildId, buildNumber)
      .then((resp) => {
        this.moduleBuildsList = resp;

        this.trigger({
          moduleBuildsList: this.moduleBuildsList,
          loading: false
        });
      });
  },

  onStartPolling(params) {
    this.params = params;
    this.shouldPoll = true;
    this._poll();
  },

  onStopPolling() {
    this.shouldPoll = false;
  },

  onCancelBuild(repoBuildId) {
    RepoBuildApi.cancelBuild(repoBuildId);
  },

  _poll() {
    this.onLoadModuleBuilds(this.params);
    this.onLoadRepoBuild(this.params);

    if (this.shouldPoll) {
      setTimeout(this._poll, window.config.activeBuildModuleRefresh);
    }
  }

});

export default RepoBuildStore;
