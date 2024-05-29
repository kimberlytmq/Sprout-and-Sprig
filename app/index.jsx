import { Text, View, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import { Link, Redirect, router, Tabs } from "expo-router";
import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Search from "./(tabs)/search";
import LogIn from "./(auth)/log-in";


function OnboardingScreen() {
  return (
    <View style={styles.container}>
    <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
    <TouchableOpacity style={styles.button} onPress={() => router.push('/log-in')} >
      <Text style={styles.buttonText} >Continue with Email</Text>
    </TouchableOpacity>
    
    {/*using this just to see home and the tabs for now, can rm later
    <Link href="/search" style={styles.container}>Go to Main</Link> */}
  </View>
  
);
}

const Stack = createNativeStackNavigator();

const InsideStack = createNativeStackNavigator();

function InsideLayout() {
   return (
    <InsideStack.Navigator>
      <InsideStack.Screen name="Search" component={Search}/>
    </InsideStack.Navigator>
   );
}


export default function Index() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(FIREBASE_AUTH, (user) => {
      console.log('user', user);
      setUser(user);
    })
  }, [])
  return (
      <NavigationContainer independent={true}>
        <Stack.Navigator>
          {user ? (<Stack.Screen name="Search" component={Search} options={{headerShown: false}} />)
                : (<Stack.Screen name="OnboardingScreen" component={OnboardingScreen} /* can replace this with OnboardingScreen to get onboarding screen*/ 
                    options={{headerShown: false}} />)
          }
        
        </Stack.Navigator>
      </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 300,
    backgroundColor: "#E9F7EF"
    
  },
  logo: {
    marginTop: 200,
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
  }

});
