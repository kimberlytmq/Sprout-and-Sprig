import { View, Text, StyleSheet, FlatList, SafeAreaView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import plantSpecies from '../../context/species_data.json';

const Biodex = () => {
  const defaultImageUrl = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';
  const [images, setImages] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchImages = async () => {
    const docRef = doc(db, "images", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setImages(docSnap.data().images);
      //console.log("User's gallery: ", images);
    } else {
      console.log("No such document");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchImages();
    setRefreshing(false);
  }
  
  useEffect(() => {   
    fetchImages();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Biodex</Text>
      <FlatList 
        data={images}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <View style={styles.card}>
              <Image source={{uri: item}} style={styles.image}/>
            </View>
          )
        }}
        refreshing={refreshing}
        onRefresh={handleRefresh}   
      />
    </SafeAreaView>
  )
}

export default Biodex

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 28,
    color: "#397004",
    fontWeight: 'bold',
    marginTop: 10

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
    //flexDirection: "row",
    //flexWrap: "wrap",
  },
  image: {
    width: 150,
    height: 150,
    // marginRight: 5,
    // marginTop: 5,
    // marginBottom: 5
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