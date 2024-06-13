import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'

const Search = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      <Text>Search</Text>
      
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