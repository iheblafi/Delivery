import { View, Text, Image, ScrollView, SafeAreaView, Dimensions, Alert } from 'react-native'
import React, { useContext, useState, FC } from 'react'
import { Link, useNavigation, router } from "expo-router";
import axios from 'axios';
import { useAuth } from '@/context/auth';

import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomAlert from '@/components/CustomAlert';
import CONFIG from '../config/config';


interface FormState {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const navigation = useNavigation(); // Correct way to use navigation
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const { setState } = useAuth(); // Use the custom hook to access the context



  const handleSubmit = async () => {
    setSubmitting(true);
    console.log("Submitting form with values:", form);
    try {
      if (form.email === '' || form.password === '') {
        setAlertMessage('All fields are required');
        setAlertVisible(true);
        console.log("Validation failed: All fields are required");
        setSubmitting(false);
        return;
      }

      const resp = await axios.post(`${CONFIG.API_BASE_URL}/api/auth/login`, {
        email: form.email,
        password: form.password

      });

  //     const { token } = resp.data;
  //     await AsyncStorage.setItem('token', token);
  //     setAlertMessage("Sign In successfully");
  //     setAlertVisible(true);
  //     console.log("Sign In Successful, navigating to Home");
  //     router.replace("/home");
  //     // Navigate to Home
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     setAlertMessage(`Error signing in Please try again later.}`);
  //     setAlertVisible(true);
  //   }
  // };

      console.log("Received response:", resp.data);
      if (resp.data && resp.data.error) {
        setAlertMessage(resp.data.error);
        setAlertVisible(true);
        console.log("Server responded with an error:", resp.data.error);
      } else {
        setState(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        const { token } = resp.data;
        await AsyncStorage.setItem('token', token);
        setAlertMessage("Sign In successfully");
        setAlertVisible(true);
        console.log("Sign In Successful, navigating to Home");
        router.replace("/home");
      }
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      if (error.response && error.response.data) {
        console.error("Response Data:", error.response.data);
        setAlertMessage(`Error signing in: ${error.response.data.message || "Please try again later."}`);
        setAlertVisible(true);
      } else {
        setAlertMessage("Error signing in Please try again later");
        setAlertVisible(true);      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full" >
      <ScrollView>
        <View
          className="w-full flex justify-center min-h-[85vh] px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <View className="flex justify-center pt-5 flex-row gap-2">

            <Image
              source={images.trucklogo3}
              resizeMode="contain"
              className="w-[140px] h-[100px] flex justify-center"
            />
          </View>

          <Text className="text-2xl font-semibold text-white mt-5 font-psemibold">
            Log in to Transporty
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e: string) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"

            value={form.password}
            handleChangeText={(e: string) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-greenesh"
            >
              Signup
            </Link>
          </View>
        </View>
        <CustomAlert isVisible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />

      </ScrollView>
    </SafeAreaView>

  );

};

export default SignIn 