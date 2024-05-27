import { View, Text } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';


const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

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
    <View>
      <Text>SignUp</Text>
    </View>
  )
}

export default SignUp