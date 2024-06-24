import { View, Text, Button, StyleSheet, TextInput, SafeAreaView, FlatList, Image } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from 'react';
import plantSpecies from '../../context/species_data.json';
import filter from 'lodash.filter';

const Search = ({ navigation }) => {
  const defaultImageUrl = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState(plantSpecies)
  const [fullData, setFullData] = useState(plantSpecies)

  useEffect(() => {
    setFullData(plantSpecies);
    setData(plantSpecies);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase();
    const filteredData = filter(plantSpecies, (plant) => {
      return contains(plant, formattedQuery)
    })
    setData(filteredData)
  }

  const contains = ({common_name, scientific_name}, query) => {
    if (
      (common_name && common_name.toLowerCase().includes(query)) ||
      (scientific_name && scientific_name.some(name => name.toLowerCase().includes(query)))
    ) {
      return true
    }
    return false
  }

  return (
    <SafeAreaView style={styles.container}>
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
            clearButtonMode='always'
            value={searchQuery}
            onChangeText={(query) => handleSearch(query)}
            autoCorrect={false}
            />
      </View>
      <View style={styles.listContainer}>
      <FlatList
         data={data}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => {
          const thumbnailUrl = item.default_image ? item.default_image.thumbnail : defaultImageUrl;
          return (
            <View style={styles.card} key={item.id}>
              <Image source={{uri: thumbnailUrl}} style={styles.image}/>
              <View style={styles.textContainer}>
                <Text style={styles.cardHeader}>{item.common_name}</Text>
                <Text style={styles.smallText}>{item.scientific_name}</Text>
              </View>
            </View>
          )
         }}
         contentContainerStyle={styles.list}
      />
    </View>
    </SafeAreaView>
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
    margin: 10
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#397004",
    padding: 15
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20
  },
  input: {
    height: 40,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#D4EFDF",
    fontSize: 18,
    width: 350,
    borderColor: 'white'
  },
  listContainer: {
    flex: 1
  },
  list: {
    paddingBottom: 10
  },
  card: {
    borderColor: "#397004",
    borderWidth: 1,
    backgroundColor: "#E9F7EF",
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 20,
    marginTop: 5,
    marginBottom: 5
  },
  textContainer: {
    justifyContent: 'center',
  },
  cardHeader: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2
  },
  smallText: {
    fontSize: 12,
    fontStyle: "italic"
  }
  
});