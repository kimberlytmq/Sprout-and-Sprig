import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig'
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";

const Biodex = () => {
  const [plants, setPlants] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const bottomSheetRef = useRef(null);
  const moreLikeThisSheetRef = useRef(null);
  const snapPoints = ['30%'];
  const [currentPlant, setCurrentPlant] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  //get plant data from Firebase
  const fetchImages = async () => {
    const docRef = doc(db, "plants", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPlants(docSnap.data().plants || []);
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

  /*
  const removePlant = async () => { 
      setIsLoading(true);
      const docRef = doc(db, "images", user.uid);
      await updateDoc(docRef, {
        plants: arrayRemove(currentPlant)
      });
      console.log("plant removed from biodex")
      fetchPlants();
      setIsLoading(false);
  };
  */

   //delete a plant
   const removePlant = async (plant) => {
    setIsLoading(true)
    try {
      const docRef = doc(db, "plants", user.uid)
      await updateDoc(docRef, {
        plants: arrayRemove(plant)
      })
      console.log("plant deleted")
      setPlants((currentPlant) => currentPlant.filter((p) => p !== pin))
    } catch (error) {
      console.error('Error deleting pin:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const moreLikeThis = async () => {
    moreLikeThisSheetRef.current?.present();
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
              data={plants}
              numColumns={2}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <TouchableOpacity onPress={() => openBottomSheet(item)}>
                      <Image source={{uri: item.image}} style={styles.image}/>
                      <Text style={styles.plantText}>{item.name}</Text>
                    </TouchableOpacity>
                    
                  </View>
                )
              }}
              keyExtractor={(item, index) => index.toString()}
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

            <TouchableOpacity onPress={moreLikeThis}>
              <View style={styles.buttonContainer}>
                <Ionicons
                  name={"information-circle-outline"}
                  color={"#397004"}
                  size={26}
                />
                <Text style={styles.buttonText}>More like this</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={removePlant}>
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

        <BottomSheetModal
          ref={moreLikeThisSheetRef}
          snapPoints={(['90%'])}
          index={0}
        >
          <View>
            <Text>More plants!</Text>
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
  plantText: {
    fontSize: 15,
    padding: 5,
    justifyContent: 'center',
    color: '#397004'
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