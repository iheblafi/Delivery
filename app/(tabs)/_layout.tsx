import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Tabs, router } from 'expo-router';
import { icons } from "../../constants";
import { useNavigation, useNavigationState ,  useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar'
import AvailabilityToggle from '@/components/ToggleAvailability';
import axios from 'axios';
import { useAuth } from '@/context/auth';

interface TabIconProps {
  icon: any;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon: React.FC<TabIconProps> = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const routes = useNavigationState(state => state.routes);
  
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
  
  const handleBackPress = () => {
    // Get the previous route in the stack
    const previousRoute = routes[routes.length - 2];

    // Navigate based on the previous route name
    if (previousRoute.name === 'index') {
      // If the previous route is 'index', navigate to 'tabs/create' instead
      router.replace("/home");
    } else {
      // Otherwise, go back
      navigation.goBack();
    }
  };

  const handleLogout = async () => {
    try {
      // Remove user token from AsyncStorage
      await AsyncStorage.removeItem('userToken');
      console.log("User token removed");

      // Optionally remove other user credentials or data
      // await AsyncStorage.removeItem('otherCredential');

      // Optionally, navigate to a login screen
      router.replace("/sign-in");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const {state} = useAuth()
  const [isAvailable, setIsAvailable] = useState(state.user.isAvailable);



  const headerRightComponent = () => (
    <TouchableOpacity onPress={() => setLogoutModalVisible(true)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
            <AvailabilityToggle isAvailable={isAvailable} setIsAvailable={setIsAvailable}/>

      <Image
        source={icons.logout} // Ensure you have an appropriate logout icon in the icons object
        resizeMode="contain"
        style={{ width: 20, height: 20, tintColor: "#FFA001" }}
      />

    </TouchableOpacity>
  );

  const headerLeftComponent = () => {
    if (route.name === 'home') {
      return null;
    }
    return (

    <TouchableOpacity onPress={handleBackPress} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
      <Image
        source={icons.leftArrow} // Ensure you have an appropriate logout icon in the icons object
        resizeMode="contain"
        style={{ width: 20, height: 20, tintColor: "#FFA001" }}
      />


    </TouchableOpacity>
  );
  };


  const isHomeScreen = route.name === 'tabs/home';

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#3da58a",
            borderTopWidth: 1,
            borderTopColor: "#3da58a",
            height: 84,
          },
          headerStyle: {
            backgroundColor: "#3da58a",
            borderBottomWidth: 1,
            borderBottomColor: "#3da58a",
          },
          headerTitleStyle: {
            color: "#FFA001",
          },
          headerTintColor: "#3da58a",
          headerRight: headerRightComponent,
          headerLeft: headerLeftComponent,

        }}>
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.truck}
                color={color}
                name="History"
                focused={focused}
              />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="create"
          options={{
            title: "Goods",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.goods}
                color={color}
                name="Goods"
                focused={focused}
              />
            ),
          }}
        /> */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: true,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Profile"
                focused={focused}
              />
            ),
          }}
        />

      </Tabs>
      <StatusBar backgroundColor="#3da58a" style="light" />


      <Modal
        transparent={true}
        animationType="slide"
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Logout</Text>
            <Text style={styles.modalMessage}>Are you sure you want to logout?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  setLogoutModalVisible(false);
                  handleLogout();
                }}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: 300,
    padding: 20,
    backgroundColor: '#1E1E1E',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFA001',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#FF5A5F',
  },
  confirmButton: {
    backgroundColor: '#FFA001',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});


export default TabsLayout;
