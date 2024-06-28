import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Image, TouchableOpacity, Alert, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import { useEffect, useState, useRef } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { Link, Redirect, router } from "expo-router";
import Search from './(tabs)/search';
import { Ionicons } from "@expo/vector-icons";
import CustomKeyboardView from '../context/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import { getAuth } from 'firebase/auth';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { app, db } from '../FirebaseConfig';


export default function LogIn() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);
  const auth = getAuth();

  const {login} = useAuth();

  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async () => {
    if(!emailRef.current || !passwordRef.current) {
      Alert.alert('Log in', "Log in failed.");
      return
    }

    setLoading(true)
    const response = await login(emailRef.current, passwordRef.current);
    setLoading(false)
    if(!response.success) {
      Alert.alert('Log In', response.msg);
    }

  };

  //forget password
  const forgotPassword = () => {
    if (!emailRef.current) {
      Alert.alert("Please enter your email address first.");
      console.log('email unknown');
    } else {
      sendPasswordResetEmail(auth, emailRef.current)
      .then(() => {
        Alert.alert("Password reset email sent!")
      }).catch((error) => {
        Alert.alert(error);
      })
    }
  }
  
  return (
    
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Log in</Text>
      </View>

      <TextInput 
        style={styles.input}
        placeholder='Email'
        autoCapitalize="none"
        onChangeText={(text) => emailRef.current=text}
      />
      
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.input}
          placeholder='Password'
          autoCapitalize='none'
          onChangeText={(text) => passwordRef.current=text}
          secureTextEntry={!showPassword}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <TouchableOpacity style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
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
          <TouchableOpacity style={styles.button} onPress={handleLogin} >
            <Text style={styles.buttonText} >Log in</Text>
          </TouchableOpacity>
          </>
        )
      }
     
      <View style={styles.signUpContainer}>
        <Text style={styles.smallText}>Don't have an account? </Text>
        <Link href="sign-up" style={styles.smallButton}>Sign up</Link>
      </View>

      <TouchableOpacity onPress={forgotPassword}>
        <Text style={styles.smallButton}>Forgot password?</Text>
      </TouchableOpacity>
        
    </KeyboardAvoidingView>
    
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E9F7EF",
  },
  logoContainer: {
    top: 0,
    left: 0,
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
    alignItems: "center",
    marginBottom: 15
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