import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Ionicons } from '@expo/vector-icons';

interface CustomPickerProps {
  title: string;
  value: string;
  onValueChange: (value: string) => void;
  items: { label: string, value: string }[];
}

const CustomPicker: React.FC<CustomPickerProps> = ({ title, value, onValueChange, items }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={value}
          placeholder={{ label: 'Select Role...', value: null }}
          useNativeAndroidPickerStyle={false}
          style={pickerSelectStyles}
          Icon={() => <Ionicons name="chevron-down" size={24} color="white" />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
    fontFamily: 'pregular',
  },
  pickerContainer: {
    borderWidth: 2,
    borderColor: '#2C2C2C',
    borderRadius: 8,
    backgroundColor: '#1E1E1E',
    paddingLeft: 10,
    paddingRight: 40,
    paddingVertical: 5,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  inputAndroid: {
    fontSize: 16,
    color: 'white',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  placeholder: {
    color: '#7B7B8B',
  },
});

export default CustomPicker;
