import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { db } from '../../FirebaseConfig'
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { PLANT_API_KEY } from '../../config';


const CameraScreen = () => {
  const defaultImageUrl = 'https://storage.googleapis.com/proudcity/mebanenc/uploads/2021/03/placeholder-image.png';
  const [image, setImage] = useState(defaultImageUrl);
  const [imageBase, setImageBase] = useState(null);
  const [cameraPermission, requestCameraPermission] = ImagePicker.useCameraPermissions();
  const [mediaLibraryPermission, requestMediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const auth = getAuth();
  const user = auth.currentUser;
  const [isLoading, setIsLoading] = useState(false);
  const axios = require("axios").default;
  const [plantData, setPlantData] = useState(null);


  if (!cameraPermission) {
       // Camera permissions are still loading.
       <View />;
     }
    
    
     if (!cameraPermission?.granted) {
       // Camera permissions are not granted yet.
         <View style={styles.permissionContainer}>
           <Text style={styles.permission}>Allow access to camera?</Text>
           <TouchableOpacity style={styles.permissionButton} onPress={requestCameraPermission}>
             <Text style={styles.permissionText}>Grant Camera Permission</Text>
           </TouchableOpacity>
         </View>
       
     }
    
     if (!mediaLibraryPermission) {
      // Media Library permissions are still loading.
      <View />
     }
    
     if (!mediaLibraryPermission?.granted) {
      // Media Library permissions are not granted yet. 
        <View style={styles.permissionContainer}>
           <Text style={styles.permission}>Allow access to media library?</Text>
           <TouchableOpacity style={styles.permissionButton} onPress={requestMediaLibraryPermission}>
             <Text style={styles.permissionText}>Grant Media Library Permission</Text>
           </TouchableOpacity>
         </View>
     }

  const openCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      return (
        <View>
          <Text>Permission is needed to use camera</Text>
        </View>     
      );
    }
    console.log('Camera permission: ', permission.granted);

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const permission = ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      <Text>Permission is needed to access media library</Text>
    }
    console.log('Media library permission: ', permission.granted);

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setImageBase(result.assets[0].base64);
    }
  };

  const uploadImage = async () => {
    setIsLoading(true);
    const docRef = doc(db, "images", user.uid);
    await updateDoc(docRef, {
      images: arrayUnion(image)
    });
    console.log("image added to biodex")
    setImage(defaultImageUrl);
    setIsLoading(false);
    Alert.alert("Image added to Biodex!");
  };

  const identifyPlant = async () => {
    const data = {
      images: ["data:image/jpeg;base64," + imageBase],
      modifiers: ["crops_fast", "similar_images"],
      plant_details: [
        "common_names",
        "taxonomy",
        "url",
        "description",
        "wiki_description",
        "wiki_image",
      ],
      plant_language: "en",
      api_key: PLANT_API_KEY,
    };
    setIsLoading(true);
    try {
      const response = await axios.post(
        `https://api.plant.id/v2/identify`,
        data
      );
      setPlantData(response.data);
      console.log(response.data);
      setIsLoading(false);
      // props.navigation.navigate("ChoosePlant", {
      //   data: plantData,
      //   resetImage: removePic,
      // });
    } catch (err) {
      console.log(err);
    }
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
    <View style={styles.container}>
      <Text style={styles.title}>Plant Identifier</Text>
      <Text style={styles.subtitle}>
        Upload a photo of a plant and let us identify it!
      </Text>
      <TouchableOpacity style={styles.button} onPress={openCamera}>
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image</Text>
      </TouchableOpacity>
      <Text style={styles.imageText}>Image: </Text>
      <Image source={{ uri: image }} style={styles.image} /> 
      {image && image!=defaultImageUrl 
      && 
      <TouchableOpacity style={styles.button} onPress={uploadImage}>
        <Text style={styles.buttonText}>Add image to Biodex</Text>
      </TouchableOpacity>
      &&
      <TouchableOpacity style={styles.button} onPress={identifyPlant}>
        <Text style={styles.buttonText}>Identify plant</Text>
      </TouchableOpacity>
      }

      <Text>{plantData?.suggestions[0].plant_name}</Text>
      
      
    </View>
  )
}

export default CameraScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#E9F7EF"
  },
  title: {
    fontSize: 28,
    color: "#397004",
    fontWeight: 'bold',
    marginBottom: 10
  },
  subtitle: {
    fontSize: 15,
    color: "#397004",
    marginBottom: 20
  },
  button: {
    backgroundColor: "#397004",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    marginTop: 10,
    borderWidth: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageText: {
    color: "#397004",
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20
  }
})