import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';

interface CustomAlertProps {
  isVisible: boolean;
  message: string;
  onClose: () => void;
}

const CustomAlert: React.FC<CustomAlertProps> = ({ isVisible, message, onClose }) => {
  return (
    <Modal isVisible={isVisible}>
      <View className="bg-black-100 p-6 rounded-2xl">
        <Text className="text-white text-lg mb-4">{message}</Text>
        <TouchableOpacity onPress={onClose} className="bg-greenesh py-2 px-4 rounded-xl">
          <Text className="text-white text-center">OK</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CustomAlert;
