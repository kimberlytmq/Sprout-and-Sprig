import { Text, View, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthContextProvider, useAuth } from "../context/authContext";



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
