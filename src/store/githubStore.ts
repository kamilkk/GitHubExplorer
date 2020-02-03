import { types, flow, applySnapshot, onSnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-community/async-storage';
import debounce from 'lodash/debounce';

const storageID = 'GithubStore';

async function fetchReposApi(orgName: string) {
  const response = await fetch(`https://api.github.com/orgs/${orgName}/repos`);
  return await response.json();
}

const OrganisationRepos = types
  .model('OrganisationRepos', {
    organisation: types.identifier,
    isFetching: types.boolean,
    error: types.maybeNull(types.string),
    items: types.array(types.frozen()),
  })
  .actions(self => {
    const fetchState = () => {
      self.error = null;
      self.isFetching = true;
    };

    const errorState = (e: string) => {
      self.error = e;
      self.isFetching = false;
    };

    const receiveState = (items: any) => {
      self.error = null;
      self.isFetching = false;
      self.items = items;
    };

    return {
      fetchState,
      errorState,
      receiveState,
    };
  });

const GithubStore = types
  .model('GithubStore', {
    selectedOrganisation: types.string,
    repos: types.map(OrganisationRepos),
  })
  .views(self => ({
    get reposForSelectedOrganisation() {
      return (
        self.repos.get(self.selectedOrganisation) || {
          organisation: self.selectedOrganisation,
          isFetching: false,
          error: null,
          items: [],
        }
      );
    },
  }))
  .actions(self => {
    const selectOrganisation = (organisation: string) => {
      self.selectedOrganisation = organisation;
    };

    const fetchOrganisationRepos = flow(function*(
      organisation: string = self.selectedOrganisation,
    ) {
      if (!self.repos.has(organisation)) {
        self.repos.put({
          organisation,
          isFetching: false,
          error: null,
          items: [],
        });
      }
      self.repos.get(organisation)!.fetchState();
      try {
        const json = yield fetchReposApi(organisation);
        self.repos.get(organisation)!.receiveState(json);
      } catch (e) {
        console.debug('e', e);
        self.repos.get(organisation)!.errorState(e.toString());
      }
      return self.repos.get(organisation)!.items.length;
    });

    const hydrate = () => {
      return flow(function*() {
        const data = yield AsyncStorage.getItem(storageID);
        if (data) {
          applySnapshot(GithubStore, JSON.parse(data));
        }
      })();
    };

    return {
      selectOrganisation,
      fetchOrganisationRepos,
      hydrate,
    };
  })
  .create({
    selectedOrganisation: 'callstack',
    repos: {},
  });

// persisting the stores
onSnapshot(
  GithubStore,
  debounce(
    snapshot => AsyncStorage.setItem(storageID, JSON.stringify(snapshot)),
    1000,
  ),
);

export default GithubStore;
