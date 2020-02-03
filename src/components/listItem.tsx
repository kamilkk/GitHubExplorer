import * as React from 'react';
import { View, Text } from 'react-native';

interface Props {
  title: string;
  textSize: number;
}

const ListItem: React.FC<Props> = ({ title, textSize }): JSX.Element => (
  <View style={{ padding: 12 }}>
    <Text style={{ fontSize: textSize }}>{title}</Text>
  </View>
);

export default ListItem;
