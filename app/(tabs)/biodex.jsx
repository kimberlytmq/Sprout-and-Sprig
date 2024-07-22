import { View, Text, StyleSheet, FlatList, SafeAreaView, Image, TouchableOpacity, ActivityIndicator, RefreshControl, ScrollView, Pressable} from 'react-native'
import { Link, router } from "expo-router";
import React, { useState, useEffect, useRef } from 'react'
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig'
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { Ionicons } from "@expo/vector-icons";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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
  const [similarPlants, setSimilarPlants] = useState([]);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  //get plant data from Firebase
  const fetchPlants = async () => {
    try {
      const docRef = doc(db, "plants", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPlants(docSnap.data().plants || []);
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error('Error fetching plants: ', error)
    }
  };

  /*
  const fetchImages = async () => {
    const docRef = doc(db, "plants", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPlants(docSnap.data().plants || []);
    } else {
      console.log("No such document");
    }
  };
  */

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPlants();
    setRefreshing(false);
  }
  
  useEffect(() => {   
    fetchPlants();
  }, []);

  const openBottomSheet = (plant) => {
    setCurrentPlant(plant);
    //console.log(plant);
    bottomSheetRef.current?.present();
  }

   //delete a plant
   const removePlant = async (plant) => {
    setIsLoading(true)
    try {
      const docRef = doc(db, "plants", user.uid)
      await updateDoc(docRef, {
        plants: arrayRemove(plant)
      })
      console.log("plant deleted")
      setPlants((currentPlant) => currentPlant.filter((p) => p !== plant))
    } catch (error) {
      console.error('Error deleting plant:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // AI to generate similar plants

  const moreLikeThis = async () => {
    setIsLoading(true);
    try {
      const chatSession = model.startChat({
        generationConfig,
      // safetySettings: Adjust safety settings
      // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
        ],
      });
      console.log(currentPlant.name);
      const result = await chatSession.sendMessage(
        `Name 3 plants similar to ${currentPlant.name} and include the common name, scientific name and description for each in JSON format.`
      );
      
      const similarPlantsData = JSON.parse(result.response.text());
      console.log(similarPlantsData.plants);
      setSimilarPlants(similarPlantsData.plants);
      moreLikeThisSheetRef.current?.present();
      //console.log(similarPlants);

    } catch (error) {
      console.error('Error fetching similar plants:', error);
      console.error('Response:', error.response?.text ? error.response.text() : 'No response text available');
    } finally {
      setIsLoading(false);
    }
    
  };

  // if (isLoading) {
  //   return (
  //     <SafeAreaView style={styles.loadingContainer}>
  //       <ActivityIndicator size="large"/>
  //       <Text>Loading</Text>
  //     </SafeAreaView>
  //   )
  // }

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

        { isLoading ? (<ActivityIndicator size="large" color="#397004"/> 
            ) : (
              <>
              <View style={styles.bottomSheetContainer}>
                <Pressable onPress={moreLikeThis} >
                  <View style={styles.buttonContainer}>
                    <Ionicons
                      name={"information-circle-outline"}
                      color={"#397004"}
                      size={26}
                    />
                    <Text style={styles.buttonText}>More like this</Text>
                  </View>
                </Pressable>

                <TouchableOpacity onPress={() => removePlant(currentPlant)}>
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
              </>
            )
        }
          

        </BottomSheetModal>

        <BottomSheetModal
          ref={moreLikeThisSheetRef}
          snapPoints={['80%']}
          index={0}
        >
          <View>
            <Text style={styles.morePlantsTitle}>More plants like {currentPlant.name}</Text>
            <FlatList
              data={similarPlants}
              renderItem={({ item }) => {
                return (
                  <View style={styles.card}>
                    <Text style={styles.morePlantsTitle}>{item.common_name}</Text>
                    <Text style={styles.morePlantsSubtitle}>{item.scientific_name}</Text>
                    <Text style={styles.morePlantsText}>{item.description}</Text>
                </View>
                );
              }}
            
              keyExtractor={(item, index) => index.toString()}
            />
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
    alignSelf: 'center',
    color: '#397004',
    fontWeight: 'bold'
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
  },
  morePlantsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: "#397004",
    marginBottom: 5
  },
  morePlantsSubtitle: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: "#397004",
    marginBottom: 5
  },
  morePlantsText: {
    color: "#397004",
    alignSelf: 'center',
    fontSize: 14,
    textAlign: 'justify'
  }
});