import * as React from 'react';
import { View, Text } from 'react-native';

interface Props {
  id: number;
  name: string;
  owner: string;
  stars: number;
  created: Date;
}

const ListItem: React.FC<Props> = ({ name, owner }): JSX.Element => (
  <View style={{ padding: 12 }}>
    <Text style={{ fontSize: 16 }}>{name}</Text>
  </View>
);

export default ListItem;
