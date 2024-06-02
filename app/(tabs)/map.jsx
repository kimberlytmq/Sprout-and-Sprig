import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Map = () => {
  return (
    <View style={styles.container}>
      <Text>Map</Text>
    </View>
  )
}

export default Map

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});