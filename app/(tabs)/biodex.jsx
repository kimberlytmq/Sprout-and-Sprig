import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Biodex = () => {
  return (
    <View style={styles.container}>
      <Text>Biodex</Text>
    </View>
  )
}

export default Biodex

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});