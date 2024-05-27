import { View, Text, StyleSheet, TextInput, Button, ActivityIndicator, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Link, Redirect, router } from "expo-router";

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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

  // const signUp = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await createUserWithEmailAndPassword(auth, email, password);
  //     console.log(response);
  //     alert('Check your email!');
  //   } catch(error) {
  //     console.log(error);
  //     alert('Log in failed ' + error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // }
  
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
      <Image source={require('../../assets/images/logo.png')} style={styles.logo}/>
      </View>
      <Text style={styles.headerText}>Log in</Text>
      <TextInput 
        value={email}
        style={styles.input}
        placeholder='Email'
        autoCapitalize="none"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput 
        value={password}
        style={styles.input}
        placeholder='Password'
        autoCapitalize='none'
        onChangeText={(text) => setPassword(text)}
        secureTextEntry={true}
      />
      
      { loading ? (<ActivityIndicator size="large" color="#0000ff"/> 
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={signIn} >
              <Text style={styles.buttonText} >Log in</Text>
            </TouchableOpacity>
            <View style={styles.signUpContainer}>
              <Text style={styles.smallText}>Don't have an account? </Text>
              <Link href="/sign-up" style={styles.smallButton}>Sign up</Link>
              {/* <Button title="Sign up" onPress={signUp}/> */}
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
    marginHorizontal: 20,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#E9F7EF"
  },
  logoContainer: {
    position: 'absolute',
    top: 0,
    left: 75,
  },
  input: {
    marginVertical: 20,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff',
    fontSize: 18
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
    color: "#397004"
  },
  button: {
    backgroundColor: "#145A32",
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
  }
})