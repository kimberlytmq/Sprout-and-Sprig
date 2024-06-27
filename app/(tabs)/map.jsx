import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Button } from 'react-native';
import * as Location from "expo-location";

const SINGAPORE = {
  latitude: 1.32,
  longitude: 103.84,
  latitudeDelta: 0.005,
  longitudeDelta: 0.005
}

export default function Map() {
  const [mapRegion, setMapRegion] = useState(SINGAPORE)

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

  useEffect(() => {
    userLocation()
  }, [])
  return (
    <View style={styles.container}>
      <MapView 
      style={styles.map}
      region={mapRegion} 
      >
        <Marker coordinate={mapRegion} title='Marker'/>
      </MapView>
      <Button title='Get Location' onPress={userLocation}/>
    </View>
  )
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: 'center'
  },
  map: {
    width: '100%',
    height: '100%',
  },
});