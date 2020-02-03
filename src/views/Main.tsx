import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet } from 'react-native';
import { useObserver } from 'mobx-react';

import { useStore } from '../store';

export const MainId = 'GitHubexplorer.Main';

const dateFormat = require('dateformat');

const Header = () => {
  return (
    <View style={[styles.row, styles.headerRow]}>
      <Text style={[styles.idHeader, styles.bold]}>ID</Text>
      <Text style={[styles.titleHeader, styles.bold]}>Repo Title</Text>
      <Text style={[styles.ownerHeader, styles.bold]}>Owner</Text>
      <Text style={[styles.starsHeader, styles.bold]}>Stars</Text>
      <Text style={[styles.dateHeader, styles.bold]}>Created at</Text>
    </View>
  );
};

const Row = ({ id, title, owner, stars, created }) => {
  return (
    <View style={styles.row}>
      <Text style={styles.id}>{id}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.owner}>{owner}</Text>
      <Text style={styles.stars}>{stars}</Text>
      <Text style={styles.date}>{created}</Text>
    </View>
  );
};

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
        <Text style={styles.error}>
          Error {githubStore.reposForSelectedOrganisation.error}
        </Text>
      )}
      <FlatList
        data={githubStore.reposForSelectedOrganisation.items.slice()}
        keyExtractor={item => item.id}
        refreshing={githubStore.reposForSelectedOrganisation.isFetching}
        onRefresh={onRefresh}
        renderItem={({ item }) => (
          <Row
            id={item.id}
            title={item.name}
            owner={item.owner.login}
            stars={item.stargazers_count}
            created={dateFormat(new Date(item.created_at), 'yyyy-mm-dd')}
          />
        )}
        ListHeaderComponent={() =>
          githubStore.reposForSelectedOrganisation.items.length > 0 && (
            <Header />
          )
        }
      />
    </SafeAreaView>
  ));
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  error: {
    fontSize: 26,
    margin: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  headerRow: {
    marginBottom: 5,
  },
  row: {
    justifyContent: 'center',
    flexWrap: 'nowrap',
    flexDirection: 'row',
  },
  idHeader: {
    width: 40,
    textAlign: 'right',
  },
  id: {
    margin: 5,
    width: 40,
    textAlign: 'center',
  },
  titleHeader: {
    width: 100,
    textAlign: 'center',
  },
  title: {
    margin: 5,
    width: 100,
    textAlign: 'left',
  },
  ownerHeader: {
    width: 80,
    textAlign: 'center',
  },
  owner: {
    margin: 5,
    width: 80,
    textAlign: 'left',
  },
  starsHeader: {
    width: 30,
    textAlign: 'center',
  },
  stars: {
    margin: 5,
    width: 30,
    textAlign: 'right',
  },
  dateHeader: {
    width: 100,
    textAlign: 'center',
  },
  date: {
    margin: 5,
    width: 100,
    textAlign: 'center',
  },
  bold: {
    margin: 5,
    fontWeight: 'bold',
  },
});
