import { FlatList, Image, ListRenderItem, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import axios from 'axios';
import { images } from '@/constants';
import CONFIG from '../config/config';
import { useAuth } from '@/context/auth';
import { router, useNavigation } from 'expo-router';

  
  const Home = () => {
    const { state } = useAuth();
    const [assignedTasks, setAssignedTasks] = useState<number>(0);
    const [completedTasks, setCompletedTasks] = useState<number>(0);
    const navigation = useNavigation();
  
    useEffect(() => {
      const fetchTaskCounts = async () => {
        try {
          const deliveryId = state.user._id;
          const assignedResponse = await axios.get(`${CONFIG.API_BASE_URL}/api/delivery/auth/assigned-tasks/${deliveryId}`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          const completedResponse = await axios.get(`${CONFIG.API_BASE_URL}/api/delivery/auth/completed-tasks/${deliveryId}`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
  
          setAssignedTasks(assignedResponse.data.assignedTasks);
          setCompletedTasks(completedResponse.data.assignedTasks);
        } catch (error) {
          console.error('Error fetching task counts:', error);
        }
      };

      fetchTaskCounts();
  }, [state.user._id, state.token]);



  const handleCardPress = (type: 'assigned' | 'completed') => {
    if (type === 'assigned') {
      router.replace('assigned');
    } else if (type === 'completed') {
      router.replace('profile');
    }
  };
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to your hub</Text>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress('assigned')}>
          <Text style={styles.cardTitle}>Assigned Tasks</Text>
          <Text style={styles.cardCount}>{assignedTasks}</Text>
        </TouchableOpacity>
        </View>
        <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={() => handleCardPress('completed')}>
          <Text style={styles.cardTitle}>Completed Tasks</Text>
          <Text style={styles.cardCount}>{completedTasks}</Text>
        </TouchableOpacity>
        </View>
      </View>
     
      );
    };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fffeee',
      alignItems: "center"
  
    },

    cardContainer: {
      
      flexDirection: 'column',
      justifyContent: 'space-around',
      marginBottom:20,
      marginTop:20
    },

    card: {
      padding: 20,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
      alignItems: 'center',
      textAlign:"center",
      justifyContent: 'center',

      elevation: 5,
      width: 200,
      height: 200,
    },
    cardTitle: {
      fontSize: 18,
      marginBottom: 10,
    },

    listContainer: {
      // flex: 5,
       padding: 5,
     },

     cardCount: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: "bold",
      textAlign:'center'
    },
    commandItem: {
      flexDirection: 'row',
      padding: 10,
      marginRight: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
      alignItems: 'center',
      height:150,
      width:200,
      elevation:5,
    },
    image: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 16,
    },
    textContainer: {
      flex: 1,
      alignItems:'center',
    },
  });
  
  export default Home;
  