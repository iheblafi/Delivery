import { Link, useNavigation, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image, StyleSheet } from "react-native";
import axios from 'axios';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useState, FC } from 'react'
import { images } from "@/constants";

import { useAuth } from "@/context/auth";
import FormField from "@/components/FormField";
import CustomAlert from "@/components/CustomAlert";
import CONFIG from "../config/config";


interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

const SignUp: FC = () => {
  const navigation = useNavigation(); // Correct way to use navigation


  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });
  const { setState } = useAuth();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");


  const submit = async () => {
    setSubmitting(true);
    console.log("Submitting form with values:", form);
    try {
      if (form.username === "" || form.email === "" || form.password === "" || form.confirmPassword === "" || form.role === "") {
        setAlertMessage('All fields are required');
        setAlertVisible(true);
        setSubmitting(false);
        return;
      }
      if (form.password !== form.confirmPassword) {
        setAlertMessage("Password doesn't match");
        setAlertVisible(true);
        setSubmitting(false);
        return;
      }

      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
        role: form.role,
      };

      const resp = await axios.post(`${CONFIG.API_BASE_URL}/api/auth/register`, payload);

      console.log("Received response:", resp.data);
      if (resp.data && resp.data.error) {
        setAlertMessage(resp.data.error);
        setAlertVisible(true);
        console.log("Server responded with an error:", resp.data.error);
      } else {
        setState(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        setAlertMessage("Sign up Successfully");
        setAlertVisible(true);
        console.log("Sign up Successful, navigating to SignIn");
        router.replace("/sign-in");
      }
    } catch (error: any) {
      console.error("Error signing up:", error.message);
      if (error.response && error.response.data) {
        console.error("Response Data:", error.response.data);
        setAlertMessage(`Error signing up: ${error.response.data.message || "Please try again later."}`);
        setAlertVisible(true);
      } else {
        setAlertMessage("Error signing up Please try again later.");
        setAlertVisible(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.trucklogo3}
            resizeMode="contain"
            className="w-[130px] h-[80px]"
          />

          <Text className="text-2xl font-semibold text-white mt-2 font-psemibold">
            Sign Up to Transporty
          </Text>

          <FormField
            title="Username"
            placeholder="Username.."
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-5"
          />

          <FormField
            title="Email"
            placeholder="Email.."
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-5"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            placeholder="Passsword.."
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-5"
          />

          <FormField
            title="Confirm Password"
            placeholder="Confirm Password.."
            value={form.confirmPassword}
            handleChangeText={(e) => setForm({ ...form, confirmPassword: e })}
            otherStyles="mt-5"
            secureTextEntry={true}
          />

          

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-5"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-1 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an account already?
            </Text>
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-greenesh"
            >
              Sign in
            </Link>
          </View>
        </View>
        <CustomAlert isVisible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
});

export default SignUp;