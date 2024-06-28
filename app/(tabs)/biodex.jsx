import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig'
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import plantSpecies from '../../context/species_data.json';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";

const Biodex = () => {
  const [images, setImages] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const bottomSheetRef = useRef(null);
  const snapPoints = ['30%'];
  const [currentPlant, setCurrentPlant] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const openBottomSheet = (plant) => {
    setCurrentPlant(plant);
    //console.log(plant);
    bottomSheetRef.current?.present();
  }

  const removeImage = async () => { 
      setIsLoading(true);
      const docRef = doc(db, "images", user.uid);
      await updateDoc(docRef, {
        images: arrayRemove(currentPlant)
      });
      console.log("plant removed from biodex")
      fetchImages();
      setIsLoading(false);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large"/>
        <Text>Loading</Text>
      </SafeAreaView>
    )
  }

  return (
    <GestureHandlerRootView>
      <BottomSheetModalProvider>
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Biodex</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
              <Ionicons
                name={"refresh-outline"}
                color={"#397004"}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.subtitle}>A collection of the plants you spotted!</Text>
            <FlatList 
              data={images}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <TouchableOpacity onPress={() => openBottomSheet(item)}>
                      <Image source={{uri: item}} style={styles.image}/>
                    </TouchableOpacity>
                    
                  </View>
                )
              }}
              refreshing={refreshing}
              onRefresh={handleRefresh}   
            /> 
        </SafeAreaView>
        <BottomSheetModal
          ref={bottomSheetRef}
          snapPoints={snapPoints}
          index={0}
        >
          <View style={styles.bottomSheetContainer}>
            <View style={styles.buttonContainer}>
              <Ionicons
                name={"information-circle-outline"}
                color={"#397004"}
                size={26}
              />
              <Text style={styles.buttonText}>Learn more</Text>
            </View>

            <TouchableOpacity onPress={removeImage}>
              <View style={styles.buttonContainer}>
                <Ionicons
                  name={"trash-outline"}
                  color={"#397004"}
                  size={26}
                />
                <Text style={styles.buttonText}>Remove plant</Text>
              </View>
            </TouchableOpacity>

          </View>

        </BottomSheetModal>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
   
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
    //marginTop: 10
  },
  subtitle: {
    fontSize: 15,
    color: "#397004",
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
  },
  bottomSheetContainer: {
    backgroundColor: "#E9F7EF",
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
    marginTop: 20
  },
  buttonText: {
    color: "#397004",
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 5
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  refreshButton: {
    position: 'absolute',
    top: 65,
    left: 350
  }
});