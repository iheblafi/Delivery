// components/CustomHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { icons } from '@/constants';

interface CustomHeaderProps {
    showBackButton: boolean;
    title?: string; 
  }

const CustomHeader :  React.FC<CustomHeaderProps> = ({ showBackButton, title}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={icons.leftArrow}
          style={styles.backIcon}
        />
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#3da58a',
    borderBottomWidth: 1,
    borderBottomColor: '#3da58a',
    
  },
  backButton: {
    marginLeft:5,
    
  },
  backIcon: {
    width: 24,
    height: 24,
    tintColor: '#FFA001',
   
  },
  title: {
    flex: 1,  // Ensure title takes up available space
    textAlign: 'center',  // Center the title
    color: "#fff",  // Change color for better visibility
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomHeader;