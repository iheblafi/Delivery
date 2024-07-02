import React, { Component, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal
  ,
  Button,
  ListRenderItem,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import CONFIG from '../config/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/auth';
import { images } from '@/constants';
import { Picker } from '@react-native-picker/picker';

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



const Commands = () => {
  const { state } = useAuth();
  const [commands, setCommands] = useState<Command[]>([]);
  const [selectedCommand, setSelectedCommand] = useState<Command | null>(null);
  const [availableDeliveryMen, setAvailableDeliveryMen] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deliveryManModalVisible, setDeliveryManModalVisible] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<string>('pending');


  useEffect(() => {
    const fetchCommands = async () => {
      try {
        const response = await axios.get(`${CONFIG.API_BASE_URL}/command/getAll`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setCommands(response.data);
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    };

    fetchCommands();
  }, [state.token]);

  const fetchAvailableDeliveryMen = async () => {
    try {
      const response = await axios.get(`${CONFIG.API_BASE_URL}/api/delivery/auth/available-delivery-men`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
      });
      setAvailableDeliveryMen(response.data);
    } catch (error) {
      console.error('Error fetching delivery men:', error);
    }
  };

  const handleCommandPress = (command: Command) => {
    console.log('Command pressed:', command); // Debug log

    setSelectedCommand(command);
    //await fetchAvailableDeliveryMen();
    setStatusModalVisible(true);
  };

  // const handleAssignDeliveryMan = async (deliveryManId: string) => {
  //   if (selectedCommand) {
  //     try {
  //       await axios.put(
  //         `${CONFIG.API_BASE_URL}/command/${selectedCommand._id}/status`,
  //         {
  //           status: 'PASSED',
  //           deliveryManId: deliveryManId,
  //         },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${state.token}`,
  //           },
  //         }
  //       );
  //       setModalVisible(false);
  //       setSelectedCommand(null);
  //       // Refresh commands list
  //       const response = await axios.get(`${CONFIG.API_BASE_URL}/command/all`, {
  //         headers: {
  //           Authorization: `Bearer ${state.token}`,
  //         },
  //       });
  //       setCommands(response.data);
  //     } catch (error) {
  //       console.error('Error updating command status:', error);
  //     }
  //   }
  // };

  const handleStatusChange = async () => {
    if (selectedCommand) {
      try {
        console.log('Command ID:', selectedCommand._id);
        const response = await axios.put(
          `${CONFIG.API_BASE_URL}/command/update-status/${selectedCommand._id}`,
          { status: selectedStatus },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );

        console.log('Status change response:', response.data);
        console.log(selectedStatus)
        if (selectedStatus === 'passed') {
          await fetchAvailableDeliveryMen();
          setStatusModalVisible(false);
          setDeliveryManModalVisible(true);
        } else {
          setStatusModalVisible(false);
          setSelectedCommand(null);
          // Refresh commands list
          const response = await axios.get(`${CONFIG.API_BASE_URL}/command/getAll`, {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          });
          setCommands(response.data);
        }
      } catch (error) {
        console.error('Error updating command status:', error);
        console.error('Error response data:', error.response?.data);
      }
    }
  };

  const handleAssignDeliveryMan = async (deliveryId: string) => {
    if (selectedCommand) {
      try {
        console.log('Assigning delivery man:', deliveryId);
        console.log('Command ID:', selectedCommand._id);

        const response2 = await axios.put(
          `${CONFIG.API_BASE_URL}/command/assign-transporter/${selectedCommand._id}`, {
          // status: 'PASSED',
          deliveryId,
        },
          {
            headers: {
              Authorization: `Bearer ${state.token}`,
            },
          }
        );
        console.log('Assign transporter response:', response2.data);
        Alert.alert('Success', 'Delivery man assigned successfully');


        setDeliveryManModalVisible(false);
        setSelectedCommand(null);
        // Refresh commands list
        const response = await axios.get(`${CONFIG.API_BASE_URL}/command/getAll`, {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
        });
        setCommands(response.data);
      } catch (error) {
        console.error('Error updating command status:', error);
        console.error('Error response data:', error.response?.data);

      }
    }
  };

  const renderItem = ({ item }: { item: Command }) => (
    <View style={styles.commandItem}>
      <Image source={images.stock} style={styles.image} />
      <View style={styles.textContainer}>
        <Text>Product: {item.productId.name}</Text>
        <Text>Quantity: {item.quantity}</Text>
        <Text>Status: {item.status}</Text>
      </View>
      <TouchableOpacity onPress={() => handleCommandPress(item)} style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit</Text>
      </TouchableOpacity>
    </View>

  );


  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Commands</Text>
      <FlatList
        data={commands}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
      />
      {/* <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Delivery Man</Text>
            {availableDeliveryMen.map((man) => (
               <TouchableOpacity
               key={man._id}
               style={styles.deliveryManItem}
               onPress={() => handleAssignDeliveryMan(man._id)}
             >
               <Text>{man.username}</Text>
             </TouchableOpacity>
           ))}
           <Button title="Close" onPress={() => setModalVisible(false)} />
         </View>
       </View>
     </Modal> */}
      <Modal visible={statusModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Status</Text>
            <Picker
              selectedValue={selectedStatus}
              onValueChange={(itemValue) => setSelectedStatus(itemValue.toString())}
              style={styles.picker}
            >
              <Picker.Item label="Pending" value="pending" />
              <Picker.Item label="Passed" value="passed" />
              <Picker.Item label="On The Way" value="on_the_way" />
              <Picker.Item label="Picked" value="picked" />
            </Picker>
            <Button title="Change Status" onPress={handleStatusChange} />
            <TouchableOpacity onPress={() => setStatusModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={deliveryManModalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Assign Delivery Man</Text>
            {availableDeliveryMen.map((man) => (
              <TouchableOpacity
                key={man._id}
                style={styles.deliveryManItem}
                onPress={() => handleAssignDeliveryMan(man._id)}
              >
                <Text>{man.username}</Text>
              </TouchableOpacity>
            ))}
            <Button title="Close" onPress={() => setDeliveryManModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};


{/* 
  // renderItem: ListRenderItem<Command> = ({ item }) => (
  //   <TouchableOpacity
  //     style={styles.commandItem}
  //     onPress={() => this.handleCommandClick(item._id)}
  //   >
  //     <View style={styles.textContainer}>
  //       <Text>Status: {item.status}</Text>
  //       <Text>Product: {item.productId.name}</Text>
  //       <Text>Quantity: {item.quantity}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

//   render() {
//     const { showModal, availableDeliveryMen } = this.state;

//     return (
//       <View style={styles.container}>
//         <View style={styles.listContainer}>
//           <Text style={styles.title}>All Commands</Text>
//           <FlatList
//             data={this.state.commands}
//             renderItem={this.renderItem}
//             keyExtractor={(item) => item._id}
//           />
//         </View>

//         {showModal && (
//           <Modal
//             animationType="slide"
//             transparent={true}
//             visible={showModal}
//             onRequestClose={() => this.setState({ showModal: false })}
//           >
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <Text style={styles.modalTitle}>Assign Delivery Man</Text>
//                 <FlatList
//                   data={availableDeliveryMen}
//                   renderItem={({ item }) => (
//                     <TouchableOpacity
//                       style={styles.deliveryManItem}
//                       onPress={() => this.assignDeliveryMan(item._id)}
//                     >
//                       <Text>{item.username}</Text>
//                     </TouchableOpacity>
//                   )}
//                   keyExtractor={(item) => item._id}
//                 />
//                 <Button title="Close" onPress={() => this.setState({ showModal: false })} />
//               </View>
//             </View>
//           </Modal>
//         )}
//       </View>
//     );
//   }
// } */}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fffeee',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 5,
  },   
  commandItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    alignItems: 'center',
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  editButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  editButtonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
  },
  picker: {
    width: '100%',
    height: 50,
  },
  closeButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  deliveryManItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
});

export default Commands;