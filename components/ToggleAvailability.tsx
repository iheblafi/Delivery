// AvailabilityToggle.js
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '@/app/config/config';

const AvailabilityToggle = ({isAvailable,setIsAvailable}) => {
 

  
  const toggleSwitch = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        axios.get(`${CONFIG.API_BASE_URL}/api/delivery/auth/toggle-avability`, {headers: {Authorization: `Bearer ${token}`}})
        .then(response => {
          setIsAvailable(response.data.isAvailable);
        })
       
      } 
      catch(error) {
        console.error('Error fetching initial availability status:', error);
        Alert.alert('Error', 'Could not fetch initial availability status.');
      };
  
  };

  return (
    <View style={styles.container}>
     {(isAvailable === false || isAvailable == true) && 
     <>
     <Text style={styles.label}>Availability:</Text>
      <Switch
        trackColor={{ false: "#D30000", true: "#008000" }}
        thumbColor={isAvailable ? "#00FF00" : "#FF2400"}
        onValueChange={toggleSwitch}
        value={isAvailable}
      />
      </>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height:100,
    flexDirection: 'row',
    marginRight: 60,
    marginBottom:0,
    justifyContent:"center",
    alignItems:"center"
  },
  label: {
    marginRight: 10,
    fontSize: 18,
    color:"#FFA001",
    fontWeight:'bold'
  },
});

export default AvailabilityToggle;
