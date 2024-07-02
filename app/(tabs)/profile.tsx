import { StyleSheet, Text, View, Image, Button, ScrollView } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/auth';
import { images } from '@/constants';

const Profile = () => {
  const { state } = useAuth();
  const user = state.user || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileCard}>
        <Image
          source={images.trucklogo3 }
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.username || 'User Name'}</Text>
        <Text style={styles.email}>{user.email || 'user@example.com'}</Text>
        <Text style={styles.city}>{user.city || 'City'}</Text>
        <Text style={styles.address}>{user.address || 'Address'}</Text>
        <Text style={styles.phone}>{user.phone || 'Phone Number'}</Text>
        
        {/* Add more user details as needed */}
        <Button
          title="modify"
          onPress={() => {
            // Implement logout functionality
          }}
          color="#ff3b30"
        />
      </View>
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  city: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  address: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  phone: {
    fontSize: 16,
    color: '#666',
    marginBottom: 12,
  },
});
