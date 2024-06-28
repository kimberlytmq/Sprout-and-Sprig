import React, { useEffect, useState } from 'react';
import MapView, { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Button, Text } from 'react-native';
import * as Location from "expo-location";
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';

const SINGAPORE = {
  latitude: 1.32,
  longitude: 103.84,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

export default function Map() {
  const [mapRegion, setMapRegion] = useState(SINGAPORE);
  const [pins, setPins] = useState([]);

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
      callout: 'This is a callout',
    }
    setPins((currentPins) => [...currentPins, newPin])
    savePin(newPin)
  }

  useEffect(() => {
    userLocation()
  }, [])

  return (
    <View style={styles.container}>
      <MapView 
      style={styles.map}
      region={mapRegion} 
      onRegionChangeComplete={setMapRegion}
      >
        {pins.map((pin, index) => (
          <Marker key={index} coordinate={pin.coordinate}>
            <Callout>
              <View>
                <Text>{pin.callout}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      <View>
        <Button title="Drop Pin" onPress={addPin} disabled={isLoading}/>
      </View>
    </View>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '80%',
  },
});