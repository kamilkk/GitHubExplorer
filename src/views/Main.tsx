import React from 'react';
import { SafeAreaView, Text, FlatList, StyleSheet } from 'react-native';
import { useObserver } from 'mobx-react';

import { useStore } from '../store';
import Item from '../components/listItem';

export const MainId = 'GitHubexplorer.Main';

export const Main: NavigationComponent_MobX<{}> = ({
  componentId,
}): JSX.Element => {
  const { githubStore } = useStore();

  React.useEffect(() => {
    githubStore.fetchOrganisationRepos();
  }, [componentId]);

  const onRefresh = () => {
    githubStore.fetchOrganisationRepos();
  };

  return useObserver(() => (
    <SafeAreaView style={styles.container}>
      {githubStore.reposForSelectedOrganisation.error && (
        <Text>Error {githubStore.reposForSelectedOrganisation.error}</Text>
      )}
      <FlatList
        data={githubStore.reposForSelectedOrganisation.items.slice()}
        keyExtractor={item => item.id}
        refreshing={githubStore.reposForSelectedOrganisation.isFetching}
        onRefresh={onRefresh}
        renderItem={({ item }) => <Item title={item.name} textSize={16} />}
      />
    </SafeAreaView>
  ));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 26,
    margin: 16,
  },
});
