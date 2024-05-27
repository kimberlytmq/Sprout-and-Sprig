import { View, Text, StyleSheet, TextInput, Button} from 'react-native';
import React from 'react';
import { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { ActivityIndicator } from 'react-native-web';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

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

  const signUp = async () => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      console.log(response);
      alert('Check your email!');
    } catch(error) {
      console.log(error);
      alert('Log in failed ' + error.message);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <View style={styles.container}>
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
            <Button title="Login" onPress={signIn}/>
            <Button title="Sign up" onPress={signUp}/>
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
    justifyContent: 'center'
  },
  input: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    backgroundColor: '#fff'
  }
})