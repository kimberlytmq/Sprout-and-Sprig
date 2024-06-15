import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";

const EditProfile = () => {
  return (
    <View style={styles.container}>
      <Text>editProfile</Text>
      <View style={styles.arrowContainer}>
        <Link href='/(tabs)/profile' asChild>
          <TouchableOpacity>
            <Ionicons 
              name={'chevron-back'}
              color={'black'}
              size={25}/>
          </TouchableOpacity>
        </Link>

      </View>
      
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    arrowContainer: {
      position: 'absolute',
      top: 60,
      left: 10
    }
})