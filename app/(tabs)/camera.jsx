import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Camera = () => {
  return (
    <View style={styles.container}>
      <Text>Camera</Text>
    </View>
  )
}

export default Camera

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});