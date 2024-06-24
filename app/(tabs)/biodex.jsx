import { View, Text, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native'
import React from 'react'
import plantSpecies from '../../context/species_data.json';

const Biodex = () => {
  const defaultImageUrl = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
         data={plantSpecies}
         keyExtractor={(item) => item.id.toString()}
         renderItem={({ item }) => {
          const thumbnailUrl = item.default_image ? item.default_image.thumbnail : defaultImageUrl;
          return (
            <View style={styles.card} key={item.id}>
              <Image source={{uri: thumbnailUrl}} style={styles.image}/>
              <View style={styles.textContainer}>
                <Text style={styles.header}>{item.common_name}</Text>
                <Text style={styles.smallText}>{item.scientific_name}</Text>
              </View>
              
            </View>
          )
         }}
      />
    </SafeAreaView>
  )
}

export default Biodex

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    flex: 1,
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
  header: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 2
  },
  smallText: {
    fontSize: 12,
    fontStyle: "italic"
  }
});