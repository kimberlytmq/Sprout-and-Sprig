import { View, Text, Button, StyleSheet, TextInput, SafeAreaView, FlatList, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect, useRef } from 'react';
import plantSpecies from '../../context/species_data.json';
import filter from 'lodash.filter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const Search = ({ navigation }) => {
  const defaultImageUrl = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';
  const [searchQuery, setSearchQuery] = useState("")
  const [data, setData] = useState(plantSpecies)
  const [fullData, setFullData] = useState(plantSpecies)
  const bottomSheetRef = useRef(null);
  const snapPoints = ["90%"];
  const [plantDetails, setPlantDetails] = useState('');

  useEffect(() => {
    setFullData(plantSpecies);
    setData(plantSpecies);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query)
    const formattedQuery = query.toLowerCase().replace(/[\u2019]/g, "'");
    const filteredData = filter(plantSpecies, (plant) => {
      return contains(plant, formattedQuery)
    })
    setData(filteredData)
  }

  const contains = ({common_name, scientific_name}, query) => {
    const normalizedCommonName = common_name ? common_name.toLowerCase().replace(/[\u2019]/g, "'") : "";
    const normalizedScientificNames = scientific_name ? scientific_name.map(name => name.toLowerCase().replace(/[\u2019]/g, "'")) : [];

    if (
      (normalizedCommonName && normalizedCommonName.includes(query)) ||
      (normalizedScientificNames && normalizedScientificNames.some(name => name.includes(query)))
    ) {
      return true;
    }
    return false;
  };

  const openBottomSheet = (item) => {
    //console.log(item);
    setPlantDetails(item);
    bottomSheetRef.current?.present();
  }

  const renderPlant = ({ item }) => {
    const thumbnailUrl = item.default_image ? item.default_image.thumbnail : defaultImageUrl;
    return (
      <TouchableOpacity onPress={() => openBottomSheet(item)}>
        <View style={styles.card} key={item.id}>
          <Image source={{uri: thumbnailUrl}} style={styles.image}/>
          <View style={styles.textContainer}>
            <Text style={styles.cardHeader}>{item.common_name}</Text>
            <Text style={styles.smallText}>{item.scientific_name}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
    )
   }


  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
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
            renderItem={renderPlant}
            contentContainerStyle={styles.list}
          />
        </View>
      </SafeAreaView>

      <BottomSheetModal 
        ref={bottomSheetRef} 
        snapPoints={snapPoints}
        index={0}>
        <View style={styles.bottomSheetContainer}>
          <Image 
            source={{uri: plantDetails.default_image?.small_url}}
            style={styles.detailsImage}
          />
          <Text style={styles.plantNameText}>{plantDetails.common_name}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.plantDetailsText}>Scientific name: {plantDetails.scientific_name}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.plantDetailsText}>Other names: </Text>
              <View style={{marginLeft: 5, marginBottom: 10}}>
                {plantDetails.other_name?.map((name) => {
                    return(
                      <View key={name}>
                        <Text style={styles.detailsListText}>{name}</Text>
                      </View>
                    );
                  })} 

              </View>
              
            </View>
            <Text style={styles.plantDetailsText}>Cycle: {plantDetails.cycle}</Text>
            <Text style={styles.plantDetailsText}>Watering: {plantDetails.watering}</Text>
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.plantDetailsText}>Sunlight: </Text>
              <View style={{marginLeft: 5, marginBottom: 10}}>
                {plantDetails.sunlight?.map((sunlight) => {
                  return(
                    <View key={sunlight}>
                      <Text style={styles.detailsListText}>{sunlight}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

          </View>
          
        </View>
      </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
    
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
  },
  bottomSheetContainer: {
    backgroundColor: "#E9F7EF",
    flex: 1,
    alignItems: 'center',
  },
  detailsImage: {
    width: 200,
    height: 200,
    marginTop: 20,
    marginBottom: 10
  },
  plantNameText: {
    color: "#145A32",
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 25
  },
  detailsContainer: {
    flex: 1,
    alignSelf: 'flex-start',
    marginLeft: 15
  },
  plantDetailsText: {
    color: "#145A32",
    fontSize: 16,
    marginBottom: 10
  },
  detailsListText: {
    color: "#145A32",
    fontSize: 16,
    marginBottom: 2
  }
  
});