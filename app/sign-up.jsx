import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import { useState, useRef } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, Redirect, router } from "expo-router";
import CustomKeyboardView from '../context/CustomKeyboardView';
import { useAuth } from '../context/authContext';

/*
const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('You can log in now!');
      router.replace('/log-in');
    } catch(error) {
      console.log(error);
      alert('Log in failed ' + error.message);
    } finally {
      setLoading(false);
    }
  }

  */

export default function SignUp() {
  const {signup} = useAuth();
  const [loading, setLoading] = useState(false);

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const usernameRef = useRef("");

  const handleSignUp = async ()=>{
    if(!emailRef.current || !passwordRef.current || !usernameRef.current) {
      Alert.alert('Sign up', "Please fill all the fields!")
      return;
    }
    setLoading(true);

    let response = await signup(usernameRef.current, emailRef.current, passwordRef.current)
    setLoading(false);

    console.log('got result: ', response);
    if(!response.success) {
      Alert.alert('Sign Up', response.msg);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
      </View>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Sign Up</Text>
      </View>
      

      <TextInput 
        style={styles.input}
        placeholder='Username'
        autoCapitalize="none"
        onChangeText={text => usernameRef.current=text}
      />

      <TextInput 
        style={styles.input}
        placeholder='Email'
        autoCapitalize="none"
        onChangeText={text => emailRef.current=text}
      />

      <TextInput 
        style={styles.input}
        placeholder='Password'
        autoCapitalize='none'
        onChangeText={text => passwordRef.current=text}
        secureTextEntry={true}
      />
      
      { loading ? (<ActivityIndicator size="large" color="#0000ff"/> 
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={handleSignUp} >
              <Text style={styles.buttonText} >Sign Up</Text>
            </TouchableOpacity>       
          </>
        )
      }

      <View style={styles.signUpContainer}>
        <Text style={styles.smallText}>Already have an account? </Text>
        <Link href="log-in" style={styles.smallButton}>Log in</Link>
              {/* <Button title="Sign up" onPress={signUp}/> */}
      </View>
        
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#E9F7EF"
  },
  logoContainer: {
    position: 'absolute',
    top: 30,
    left: 100,
  },
  input: {
    marginVertical: 15,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 18,
    borderColor: 'white',
    width: 350,
    marginLeft: 20
  },
  logo: {
    resizeMode: "contain",
    height: 200,
    width: 200,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 35,
    marginBottom: 15,
    color: "#397004",
    marginLeft: 135
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
    marginTop: 20,
    marginLeft: 20
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
  }
})
  

