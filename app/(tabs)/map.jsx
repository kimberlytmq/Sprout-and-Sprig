import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Button, Text, Modal, TextInput, Pressable, TouchableOpacity } from 'react-native';
import * as Location from "expo-location";
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig';
import { doc, updateDoc, arrayUnion, getDoc, arrayRemove } from 'firebase/firestore';

const SINGAPORE = {
  latitude: 1.32,
  longitude: 103.84,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

export default function Map() {
  const [mapRegion, setMapRegion] = useState(SINGAPORE);
  const [pins, setPins] = useState([]);
  const [calloutInput, setCalloutInput] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const auth = getAuth();
  const user = auth.currentUser;
  const [errorMsg, setErrorMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  //get user current location
  const userLocation = async () => {
    let {status} = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied')
    }
    let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true})
    setMapRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005
    })
    setCurrentLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    })
    console.log(location.coords.latitude, location.coords.longitude)
  }

  //load saved pins for current user from database
  const fetchPins = async () => {
    try {
      const docRef = doc(db, "pins", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setPins(docSnap.data().pins);
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error('Error fetching pins: ', error)
    }
  };

  //save a new pin to database
  const savePin = async (pin) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "pins", user.uid);
      await updateDoc(docRef, {
        pins: arrayUnion(pin)
      });
      console.log("pin added")
    } catch (error) {
      console.error('Error saving pin:', error)
    } finally {
      setIsLoading(false);
    }
  };

  //add pin on current location and save to Firestore
  const addPin = () => {
    const newPin = {
      coordinate: {
        latitude: mapRegion.latitude,
        longitude: mapRegion.longitude
      },
      callout: calloutInput,
    }
    setPins((currentPins) => [...currentPins, newPin]);
    savePin(newPin);
    setCalloutInput('');
    setModalVisible(false);
    setCurrentLocation(null);
  }

  //update an existing pin
  const updatePin = async (oldPin, newPin) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, "pins", user.uid);
      await updateDoc(docRef, {
        pins: arrayRemove(oldPin)
      })
      await updateDoc(docRef, {
        pins: arrayUnion(newPin)
      })
      console.log("pin updated")
    } catch (error) {
      console.error('Error updating pin:', error)
    } finally {
      setIsLoading(false);
    }
  } 

  //edit pin callout
  const editPin = () => {
    const updatedPin = {
      ...selectedPin,
      callout: calloutInput,
    }
    const updatedPins = pins.map(pin => pin === selectedPin ? updatedPin : pin)
    setPins(updatedPins)
    updatePin(selectedPin, updatedPin)
    setCalloutInput('')
    setModalVisible(false)
  }

  //delete a pin
  const deletePin = async (pin) => {
    setIsLoading(true)
    try {
      const docRef = doc(db, "pins", user.uid)
      await updateDoc(docRef, {
        pins: arrayRemove(pin)
      })
      console.log("pin deleted")
      setPins((currentPins) => currentPins.filter((p) => p !== pin))
    } catch (error) {
      console.error('Error deleting pin:', error)
    } finally {
      setIsLoading(false)
      setModalVisible(false)
    }
  }

  useEffect(() => {
    userLocation().then(() => {
      if (user) {
        fetchPins();
      }
    })
  }, [user])

  return (
    <View style={styles.container}>
      
      <MapView 
      style={styles.map}
      region={mapRegion} 
      onRegionChangeComplete={setMapRegion}
      >
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            pinColor="blue"
          />
        )}
        {pins.map((pin, index) => (
          <Marker key={index} coordinate={pin.coordinate}>
            <Callout onPress={() => {
              setSelectedPin(pin)
              setCalloutInput(pin.callout)
              setModalVisible(true)
            }}>
              <View>
                <Text style={styles.callout}>{pin.callout}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible)
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Enter plant name"
              onChangeText={text => setCalloutInput(text)}
              value={calloutInput}
            />
            <Pressable style={styles.smallButton} onPress={selectedPin ? editPin : addPin}>
              <Text style={styles.smallButtonText}>{selectedPin ? "Edit Pin" : "Drop Pin"}</Text>
            </Pressable>
            {selectedPin && (
              <Pressable style={styles.smallButton} onPress={() => deletePin(selectedPin)}>
                <Text style={styles.smallButtonText}>Delete Pin</Text>
              </Pressable>
            )}
          </View>
        </View>
      </Modal>


      <TouchableOpacity 
        style={styles.button} 
        onPress={() => {
          setSelectedPin(null)
          setCalloutInput('')
          setModalVisible(true)
        }}
        disabled={isLoading} >
        <Text style={styles.buttonText} >Drop Pin</Text>
      </TouchableOpacity> 

    </View>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F7EF",
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '75%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'cemter',
    alignItems: 'center',
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    }
  },
  callout: {
    color: "#397004",
    fontWeight: "bold"
  },
  button: {
    backgroundColor: "#397004",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: 150,
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white"
  },
  smallButton: {
    backgroundColor: "#D4EFDF",
    padding: 10,
    borderRadius: 15,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  smallButtonText: {
    color: "#397004",
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: 200
  }
});