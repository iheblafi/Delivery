import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, StyleSheet } from "react-native";
import { FC } from "react";

interface CustomButtonProps extends TouchableOpacityProps {
  title: string;
  handlePress: () => void;
  containerStyles?: object;
  textStyles?: object;
  isLoading?: boolean;
}

const CustomButton: FC<CustomButtonProps> = ({ 
  title, 
  handlePress, 
  containerStyles, 
  textStyles, 
  isLoading 
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[styles.button, containerStyles, isLoading && styles.loading]}
      disabled={isLoading}
    >
      <Text style={[styles.text, textStyles]}>
        {title}
      </Text>
      {isLoading && (
        <ActivityIndicator
          animating={isLoading}
          color="#fff"
          size="small"
          style={styles.indicator}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3da58a', // equivalent to 'bg-greenesh'
    borderRadius: 20, // equivalent to 'rounded-xl'
    minHeight: 62,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 1,
  },
  loading: {
    opacity: 0.5,
  },
  text: {
    color: '#161622', // equivalent to 'text-primary'
    fontFamily: 'Poppins-SemiBold', // equivalent to 'font-psemibold'
    fontSize: 18, // equivalent to 'text-lg'
  },
  indicator: {
    marginLeft: 8, // equivalent to 'ml-2'
  },
});

export default CustomButton;
