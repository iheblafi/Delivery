import { Image, Text, View, ScrollView, StatusBar } from "react-native";
import { useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from 'expo-router';
import CustomButton from "@/components/CustomButton";
import { images } from "../constants";
import AvailabilityToggle from "@/components/ToggleAvailability";

const Index: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    console.log('Index screen loaded');
  }, []);

  const handleContinueWithEmail = () => {
    console.debug('Continue with Email button clicked');
    try {
      router.push('sign-in');
      console.debug('router.push called');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#161622' }}>
      <ScrollView contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}>
        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', minHeight: '75vh', paddingHorizontal: 8 }}>
          <Text style={{ fontSize: 24, color: '#FFC900', fontWeight: 'bold', textAlign: 'center', marginTop: 10 }}>
            Trasnportation{"\n"}&{"\n"}Beyond
          </Text>
          <Image
            source={images.transport3}
            style={{ maxWidth: 400, width: '100%', height: 200, borderRadius: 50, resizeMode: 'contain' }}
          />
          <View style={{ position: 'relative', marginBottom: 5, padding: 3 }}>
            <Text style={{ fontSize: 24, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              <Text style={{ color: '#3da58a' }}>Transporty</Text>
            </Text>
            <Image
              source={images.path2}
              style={{ width: 136, height: 15, position: 'absolute', bottom: -2, right: -8, resizeMode: 'contain' }}
            />
          </View>
          <Text style={{ fontSize: 14, fontFamily: 'Poppins-Regular', color: '#F0F0F0', marginTop: 7, textAlign: 'center' }}>
            Where Creativity Meets Innovation: Embark on a Journey of Limitless Exploration with Transporty
          </Text>
          <CustomButton
            title="Continue with Email"
            handlePress={handleContinueWithEmail}
            containerStyles={{ width: '100%', marginTop: 7 }}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

export default Index;
