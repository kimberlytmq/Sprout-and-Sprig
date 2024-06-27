import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions } from 'react-native';
import * as Location from "expo-location";
import { getLocaleDirection } from 'react-native-web/dist/cjs/modules/useLocale';

const SINGAPORE = {
  latitude: 1.32,
  longitude: 103.84,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5
}

export default function Map() {
  const [currentLocation, setCurrentLocation] = useState(null)
  const [initialRegion, setInitialRegion] = useState(null)

  useEffect(() => {
    const getLocation = async () => {
      const { permission } = await Location.requestForegroundPermissionsAsync();
      if (permission != "granted") {
        console.log("Permission to access location not given");
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({})
        setCurrentLocation(location.coords)

        setInitialRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005
        })
      } catch (error) {
        console.log('Error fetching location:', error)
      }
    }

    getLocation();
  },[])

  return (
    <View style={styles.container}>
      {initialRegion ? (
        <MapView style={styles.map} initialRegion={initialRegion}>
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            />
        )}
        </MapView>
      ) : (
        <View style={styles.map} />
      )}
    </View>
  );
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