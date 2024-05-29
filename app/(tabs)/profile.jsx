import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH } from '../../FirebaseConfig'
import { useNavigation } from '@react-navigation/native'

const Profile = () => {
  return (
    <View>
      <Text>Profile</Text>
    </View>
  )
}

const List = () => {
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout"/>
    </View>

  )
}

export default Profile

const styles=StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})