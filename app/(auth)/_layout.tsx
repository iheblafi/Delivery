import React, { useState, FC } from 'react';
import { View, Text, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { Link, useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { images } from '@/constants';
import CustomButton from '@/components/CustomButton';
import FormField from '@/components/FormField';
import CustomAlert from '@/components/CustomAlert';
import { useAuth } from '@/context/auth';
import CONFIG from '../config/config';

interface FormState {
  email: string;
  password: string;
}

const SignIn: FC = () => {
  const router = useRouter();
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isSubmitting, setSubmitting] = useState<boolean>(false);
  const [form, setForm] = useState<FormState>({ email: "", password: "" });
  const { setState } = useAuth();

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      if (form.email === '' || form.password === '') {
        setAlertMessage('All fields are required');
        setAlertVisible(true);
        setSubmitting(false);
        return;
      }

      const resp = await axios.post( `${CONFIG.API_BASE_URL}/api/delivery/auth/login`, {
        email: form.email,
        password: form.password,
      });

      if (resp.data && resp.data.error) {
        setAlertMessage(resp.data.error);
        setAlertVisible(true);
      } else {
        setState(resp.data);
        await AsyncStorage.setItem("auth-rn", JSON.stringify(resp.data));
        const { token } = resp.data;
        await AsyncStorage.setItem('token', token);
        setAlertMessage("Sign In successfully");
        setAlertVisible(true);
        router.replace("/home");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setAlertMessage(`Error signing in: ${error.response.data.message || "Please try again later."}`);
      } else {
        setAlertMessage("Error signing in. Please try again later.");
      }
      setAlertVisible(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#161622', height: '100%' }}>
      <ScrollView>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            minHeight: Dimensions.get("window").height - 100,
            paddingHorizontal: 16,
            marginTop: 24,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 16 }}>
            <Image
              source={images.trucklogo3}
              resizeMode="contain"
              style={{ width: 140, height: 100 }}
            />
          </View>

          <Text style={{ fontSize: 24, fontWeight: '600', color: 'white', marginTop: 20 }}>
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
            containerStyles={{ marginTop: 28 }}
            isLoading={isSubmitting}
          />

          <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 20 }}>
            <Text style={{ fontSize: 18, color: 'gray' }}>
              Don't have an account?
            </Text>
            <Link href="/sign-up" style={{ fontSize: 18, fontWeight: '600', color: '#3da58a', marginLeft: 4 }}>
              Signup
            </Link>
          </View>
        </View>
        <CustomAlert isVisible={alertVisible} message={alertMessage} onClose={() => setAlertVisible(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
