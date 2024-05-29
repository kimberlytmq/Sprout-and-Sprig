import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { useEffect, useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, Redirect, router } from "expo-router";
import { useNavigation } from '@react-navigation/core';
import Search from '../(tabs)/search';
import { Ionicons } from "@expo/vector-icons";
import { RotateInDownLeft } from 'react-native-reanimated';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your email!');
    } catch(error) {
      console.log(error);
      alert('Log in failed ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  // const navigation = useNavigation();

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     if (user) {
  //       navigation.navigate("Search")
  //     }
  //   })

  //   return unsubscribe;
  // }, [])
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Log in</Text>
      </View>

      <TextInput 
        value={email}
        style={styles.input}
        placeholder='Email'
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />
      
      <View style={styles.inputContainer}>
        <TextInput 
          value={password}
          style={styles.input}
          placeholder='Password'
          autoCapitalize='none'
          onChangeText={(text) => setPassword(text)}
          secureTextEntry={showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <TouchableOpacity style={styles.eyeIcon}
          onPressIn={() => setShowPassword(false)}
          onPressOut={() => setShowPassword(true)}
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            color={"#C7C7CD"}
            size={24}
          />
        </TouchableOpacity>
      </View>
      
      { loading ? (<ActivityIndicator size="large" color="#0000ff"/> 
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={signIn} >
              <Text style={styles.buttonText} >Log in</Text>
            </TouchableOpacity>
            <View style={styles.signUpContainer}>
              <Text style={styles.smallText}>Don't have an account? </Text>
              <Link href="/sign-up" style={styles.smallButton}>Sign up</Link>
            </View>
            
          </>
        )
      }
        
        
    </View>
  )
}

export default LogIn

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E9F7EF"
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: 100,
  },
  input: {
    marginVertical: 20,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 18,
    width: 350,
    borderColor: 'white'
  },
  logo: {
    resizeMode: "contain",
    height: 200,
    width: 200,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: 20,
    color: "#397004",
    marginLeft: 0
  },
  button: {
    backgroundColor: "#397004",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    textAlign: "center",
    width: 350,
    marginBottom: 10,
    marginTop: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white"
  },
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  smallText: {
    fontSize: 15
  },
  smallButton: {
    fontSize: 15,
    color: "#397004",
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 32
  }
})