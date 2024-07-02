// // app/components/CustomHeader.tsx

// import React from 'react';
// import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
// import { icons } from '@/constants';

// interface CustomHeaderProps {
//   title: string;
// }

// const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
//   const navigation = useNavigation();

//   return (
//     <View style={styles.headerContainer}>
//       <TouchableOpacity onPress={() => navigation.navigate('tabs/create')} style={styles.backButton}>
//         <Image
//           source={icons.back}
//           resizeMode="contain"
//           style={styles.backIcon}
//         />
//       </TouchableOpacity>
//       <Text style={styles.headerTitle}>{title}</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#3da58a',
//     padding: 10,
//   },
//   backButton: {
//     marginRight: 10,
//   },
//   backIcon: {
//     width: 20,
//     height: 20,
//     tintColor: '#FFA001',
//   },
//   headerTitle: {
//     fontSize: 20,
//     color: '#FFA001',
//   },
// });

// export default CustomHeader;
