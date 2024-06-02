import { View, Text, Button, StyleSheet } from 'react-native'
import React from 'react'
import { useAuth } from '../../context/authContext';

const Search = ({ navigation }) => {
  const { logout } = useAuth();
  const handleLogout = async ()=>{
    await logout();
  }

  return (
    <View style={styles.container}>
      <Text>Search</Text>
      <Button onPress={handleLogout} title="Logout" />
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