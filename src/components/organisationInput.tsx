import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity, TextInput } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
  onEnterOrganisation: (sr: string) => void;
}

const OrganisationInput: React.FC<Props> = ({
  onEnterOrganisation,
}): JSX.Element => {
  const [value, onChangeText] = React.useState('');

  const onSearchButtonPressed = () => {
    const organisation = value.trim();

    if (organisation !== '') {
      onEnterOrganisation(organisation);
      onChangeText('');
    }
  };

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        onChangeText={text => onChangeText(text)}
        value={value}
        placeholder={'provide github owner name...'}
        autoCapitalize={'none'}
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={onSearchButtonPressed}>
        <Text style={styles.buttonText}>
          <Icon name={'search'} size={15} />
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderColor: 'lightgray',
    borderRadius: 10,
    padding: 8,
    borderWidth: 1,
    fontSize: 22,
  },
  buttonContainer: {
    marginLeft: 16,
  },
  buttonText: {
    fontSize: 32,
  },
});

export default OrganisationInput;
