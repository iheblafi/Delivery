//@ts-nocheck
import React, { useEffect, useState } from 'react';
import MapView, { Marker,Polyline } from 'react-native-maps';
import { StyleSheet, View,Text, Image, Alert } from 'react-native';
import * as Location from 'expo-location';
import CONFIG from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { router } from 'expo-router';


export default function App() {

  const [state, setState] = useState({
    latitude:0,longitude:0,error:null,routeCoordinates:[],distanceTravelled:0,valueprevLatlng:{}
  })

  const [initialRegion, setInitialRegion] = useState(null);
  const [region,setRegion] = useState(null)

// get initial position
  useEffect(() => {
   const getCurrentPosition= async () => {
    const { coords:{ latitude, longitude } } = await Location.getCurrentPositionAsync();
    setInitialRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
    // setState(s => {return {...s,latitude:latitude,longitude:longitude}});
    }

   const askPermission = async () => {
    const permission = await Location.requestForegroundPermissionsAsync();
    return permission.status === 'granted';
  };
 
  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
        const permission = await askPermission();
        return permission;
    }
    return true;
};

  checkPermission();

    getCurrentPosition();
    return () => {
      
    }
  }, [])

  // update position
  useEffect(() => {
    (async ()=>{
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted'){
        return;
      }
      let location = await Location.getCurrentPositionAsync();
      setState(state => {return{...state,latitude:location.coords.latitude,longitude:location.coords.longitude}});

      let locations = await Location.watchPositionAsync({
        accuracy:Location.Accuracy.High,
        distanceInterval:2,
        timeInterval:3000
      },(location)=>{
        setState((state)=> {return {...state,
          routeCoordinates:state.routeCoordinates.concat([{latitude:location.coords.latitude,longitude:location.coords.longitude}]),
          latitude:location.coords.latitude,longitude:location.coords.longitude}});
      })
      
    })();
  
    return () => {
      
    }
  }, [])
  

  const getMapRegion=()=>{
    return {
      latitude:state.latitude,
      longitude:state.longitude,
      latitudeDelta:0.009,
      longitudeDelta:0.009
    }
  }

  useEffect(() => {
    if (state && initialRegion) {
      setRegion({
        ...initialRegion,
        latitude: state.latitude,
        longitude: state.longitude,
      });
    }
    (async() =>{
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }
        await axios.post( `${CONFIG.API_BASE_URL}/api/delivery/auth/update-location`, {
          longitude:state?.longitude,
          latitude:state?.latitude,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      //  Alert.alert('Success', 'Command created successfully');
        //router.replace('/commands');
      } catch (error) {
        //console.error('Error creating command:', error);
      //  Alert.alert('Error', 'There was an error creating the command.');
      }
    })();
  }, [state]);
  
  return (
    <View style={styles.container}>
      <MapView key={"map"} style={styles.map} region={
        region
      }
      onRegionChangeComplete={(newRegion) => setInitialRegion({
        ...initialRegion,
        latitudeDelta: newRegion.latitudeDelta,
        longitudeDelta: newRegion.longitudeDelta,
      })}
     // showsUserLocation ={true}
      // followsUserLocation = {true}

      >
        <Polyline coordinates={state.routeCoordinates} strokeWidth={2}/>
        <Marker coordinate={getMapRegion()}>
          <Image source={require("../../assets/icons/truck.png")} style={{width:30,height:30}}/>
          </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
