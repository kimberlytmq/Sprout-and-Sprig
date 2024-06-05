import { View, Text } from 'react-native'
import React, { useEffect, useState, useRef } from 'react'
import { Stack } from 'expo-router'
import { Camera, CameraType } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'

export default function CameraScreen() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync()
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
    })()
  }, [])

  return (
    <View>
      <Text>camera</Text>
    </View>
  )
}


const styles = StyleSheet.create({})