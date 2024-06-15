import { View, Text, Button, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";

const Search = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Explore!</Text>
      </View>
      <View style={styles.searchContainer}>
        <Ionicons
          name={"search"}
          color={"#718355"}
          size={24}
          />
          <TextInput 
            style={styles.input}
            placeholder="Search for a species"
            />
      </View>
      
      
      
    </View>
  )
}

export default Search

const styles = StyleSheet.create({
  container: {
    //justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  header: {
    marginTop: 80,
    marginBottom: 20
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#397004"
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  input: {
    height: 40,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#D4EFDF",
    fontSize: 18,
    width: 350,
    borderColor: 'white'
  }
  
});