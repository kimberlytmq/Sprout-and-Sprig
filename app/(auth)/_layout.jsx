import { View, Text, StyleSheets } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
import LogIn from './log-in';
import SignUp from './sign-up';

const AuthLayout = () => {
  return(
    <>
      <Stack>
        <Stack.Screen name="log-in"
        options={{ headerShown: false}}
        />
        <Stack.Screen name="sign-up"
        options={{ headerShown: false}}
        />
      </Stack>
    </>
    
  )
}

export default AuthLayout