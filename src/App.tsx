import { Navigation } from 'react-native-navigation';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';

import { MainId, Main } from './views/Main';

import { withStoreProvider, hydrateStores } from './store';

const Views = new Map<string, React.FC<any>>();

Views.set(MainId, Main);

// Register views
Views.forEach((C, key) => {
  Navigation.registerComponent(
    key,
    () => gestureHandlerRootHOC(withStoreProvider(C)),
    () => C,
  );
});

// Here some global listeners could be placed
// ...

export const startApp = () => {
  Promise.all(hydrateStores).then(() => {
    Navigation.setRoot({
      root: {
        component: {
          name: MainId,
        },
      },
    });
  });
};
