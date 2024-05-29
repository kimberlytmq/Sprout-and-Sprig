import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { FIREBASE_AUTH} from '../../FirebaseConfig'; 

const Search = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Search</Text>
      <Button onPress={() => FIREBASE_AUTH.signOut()} title="Logout" />
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});