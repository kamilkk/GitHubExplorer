import { types, flow, applySnapshot, onSnapshot } from 'mobx-state-tree';
import AsyncStorage from '@react-native-community/async-storage';
import debounce from 'lodash/debounce';

const storageID = 'GithubStore';

async function fetchReposApi(orgName: string) {
  const response = await fetch(`https://api.github.com/orgs/${orgName}/repos`);
  return await response.json();
}

// const GithubRepo = types.model('GithubRepo', {
//   id: types.number,
//   name: types.string,
//   owner: {
//     login: types.string,
//   },
//   stargazers_count: types.number,
//   created_at: types.Date,
// });

const OrganisationRepos = types
  .model('OrganisationRepos', {
    organisation: types.identifier,
    isFetching: types.boolean,
    error: types.maybeNull(types.string),
    repos: types.array(types.frozen()),
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
      self.repos = items;
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
          repos: [],
        });
      }
      self.repos.get(organisation)!.fetchState();
      // try {
      //   const json = yield fetchPostsApi(subreddit);
      //   const posts = json.data.children.map((child: any) => child.data);
      //   self.postsBySubreddit.get(subreddit)!.receiveState(posts);
      // } catch (e) {
      //   self.postsBySubreddit.get(subreddit)!.errorState(e.toString());
      // }
      // return self.postsBySubreddit.get(subreddit)!.items.length;
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
