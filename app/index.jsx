import { Text, View, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import { useRouter } from "expo-router";



function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
    <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
    {/*
    <TouchableOpacity style={styles.button} onPress={()=> router.push('log-in')} >
      <Text style={styles.buttonText} >Continue with Email</Text>
    </TouchableOpacity>
    */}
  </View>
  
);
}

export default OnboardingScreen;

// import * as React from 'react';
// import {NavigationContainer} from '@react-navigation/native';
// import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import Profile from "./(tabs)/profile";
// import EditProfile from "./editProfile";
// //import Navigation from "./navigation";

// const Stack = createNativeStackNavigator();


// const ProfileStack = () => {
//   return (
//       <Stack.Navigator screenOptions={{
//         headerShown: true
//       }} >
//         <Stack.Screen name="Profile"component={Profile}/>
//         <Stack.Screen name="EditProfile" component={EditProfile} />
//       </Stack.Navigator>
//   );
// };

// const App = () => {
//   return (
//     <NavigationContainer>
//       <ProfileStack />
//     </NavigationContainer>
       
//   );
// };

// export default App;

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9F7EF"
    
  },
  logo: {
    resizeMode: "contain",
    height: 300,
    width: 300,
    alignSelf: "center"
  },
  button: {
    backgroundColor: "#397004",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    textAlign: "center",
    width: 350,
    marginBottom: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white"
  },
  loading: {
    color: "gray",
  }

});
