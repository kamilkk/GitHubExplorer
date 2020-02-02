import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useObserver } from 'mobx-react';

//todo: use store
//import { useStore } from '../store';

export const MainId = 'GitHubexplorer.Main';

export const Main: NavigationComponent_MobX<{}> = (): JSX.Element => {
  //todo: use store
  //const { githubStore } = useStore();

  return useObserver(() => (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Just an Empty Screen 🤷‍♂️</Text>
      <Icon name={'react'} size={100} />
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
