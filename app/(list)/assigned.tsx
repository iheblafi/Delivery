import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Button,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import CONFIG from '../config/config';
import { useAuth } from '@/context/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
interface User {
  _id: string;
  username: string;
  email: string;
  city: string;
  address: string;
  phone: string;
}

interface Product {
  _id: string;
  name: string;
}

interface Command {
  _id: string;
  userId: User;
  productId: Product;
  quantity: number;
  status: string;
}

const AssignedCommands = () => {
  const { state:stateAuth } = useAuth();
  
  const [commands, setCommands] = useState<Command[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [newStatus, setNewStatus] = useState<string>('');

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
    setState(s => {return {...s,latitude:latitude,longitude:longitude}});
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
          // routeCoordinates:state.routeCoordinates.concat([{latitude:location.coords.latitude,longitude:location.coords.longitude}]),
          latitude:location.coords.latitude,longitude:location.coords.longitude}});
      })
      
    })();
  
    return () => {
      
    }
  }, [newStatus])
  

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
          commandId:selectedCommand?._id
        }, {
          headers: {
            Authorization: `Bearer ${stateAuth.token}`,
          },
        });
      } catch (error) {
        console.error('Error creating command:', error);
      }
    })();
  }, [state]);

  useEffect(() => {
    const fetchAssignedCommands = async () => {
      try {
        console.log('Fetching assigned commands for user:', stateAuth.user._id);
        console.log('Using token:', stateAuth.token);

        const response = await axios.get(`${CONFIG.API_BASE_URL}/command/assigned-commands/${stateAuth.user._id}`, {
          headers: {
            Authorization: `Bearer ${stateAuth.token}`,
          },
        });
        console.log('Response data:', response.data);
        setCommands(response.data);
      } catch (error) {
        console.error('Error fetching assigned commands:', error.response || error.message || error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedCommands();
  }, [stateAuth.user._id, stateAuth.token]);

  const updateCommandStatus = async () => {
    if (selectedCommand && newStatus) {
      console.log(selectedCommand)
      try {
        const response = await axios.put(
          `${CONFIG.API_BASE_URL}/command/update-status/${selectedCommand._id}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${stateAuth.token}`,
            },
          }
        );
        console.log('Status update response:', response.data);
        setCommands(commands.map(command => 
          command._id === selectedCommand._id ? { ...command, status: newStatus } : command
        ));
        setModalVisible(false);
        setSelectedCommand(null);
      } catch (error) {
        console.error('Error updating command status:', error.response || error.message || error);
      }
    }

  };



  


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Commands</Text>
      <FlatList
        data={commands}
        renderItem={({ item }) => (
          <View style={styles.commandItem}>
            <Text>Product: {item.productId.name}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Status: {item.status}</Text>
            <TouchableOpacity onPress={() => { setSelectedCommand(item); setModalVisible(true); }}>
              <Text style={styles.changeStatusText}>Change status</Text>
            </TouchableOpacity>
             </View>

        )}
        keyExtractor={(item) => item._id}
      />

{selectedCommand && (
        <Modal
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Status</Text>
              <TouchableOpacity onPress={() => setNewStatus('pending')}>
                <Text style={styles.statusOption}>Pending</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewStatus('passed')}>
                <Text style={styles.statusOption}>Passed</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewStatus('picked')}>
                <Text style={styles.statusOption}>Picked</Text>
              </TouchableOpacity>
              <Button title="Update Status" onPress={updateCommandStatus} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
          <MapView key={"map"}  style={styles.map} region={
        region
      }
      onRegionChangeComplete={(newRegion) => setInitialRegion({
        ...initialRegion,
        latitudeDelta: newRegion.latitudeDelta,
        longitudeDelta: newRegion.longitudeDelta,
      })}

      >
        <Marker coordinate={getMapRegion()}>
          <Image source={require("../../assets/icons/truck.png")} style={{width:30,height:30}}/>
          </Marker>
      </MapView>
        </Modal>
)}
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffeee',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  commandItem: {
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    elevation: 5,
  },
  changeStatusText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  statusOption: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export default AssignedCommands;
