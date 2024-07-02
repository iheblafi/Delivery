import React, { useEffect } from 'react';
import { BackHandler, Alert } from 'react-native';
import { useNavigationState } from '@react-navigation/native';

interface BackButtonHandlerProps {
  children: React.ReactNode;
}

const BackButtonHandler: React.FC<BackButtonHandlerProps> = ({ children }) => {
  const navState = useNavigationState(state => state);

  useEffect(() => {
    const onBackPress = () => {
      if (navState.routes.length === 1 && navState.routes[0].name === 'Home') {
        Alert.alert('Exit App', 'Do you want to exit?', [
          { text: 'No', onPress: () => null, style: 'cancel' },
          { text: 'Yes', onPress: () => BackHandler.exitApp() },
        ]);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [navState]);

  return <>{children}</>;
};

export default BackButtonHandler;
