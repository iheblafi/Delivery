import { useState, FC } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, TextInputProps, StyleSheet } from "react-native";
import { icons } from "../constants";

interface FormFieldProps extends TextInputProps {
  title: string;
  value: string;
  placeholder?: string;
  handleChangeText: (text: string) => void;
  otherStyles?: object;
}

const FormField: FC<FormFieldProps> = ({ 
  title, 
  value, 
  placeholder, 
  handleChangeText, 
  otherStyles, 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = title === "Password" || title === "Confirm Password";

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7B7B8B"
          onChangeText={handleChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          {...props}
        />
        {isPasswordField && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#F0F0F0',
    fontFamily: 'Poppins-Medium',
    marginBottom: 8,
  },
  inputContainer: {
    width: '100%',
    height: 64,
    paddingHorizontal: 16,
    backgroundColor: '#1F1F1F', // black-100
    borderRadius: 20, // rounded-2xl
    borderWidth: 2,
    borderColor: '#333333', // black-200
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
  },
});

export default FormField;
