import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Link } from 'expo-router'
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { app, db } from '../FirebaseConfig';
import * as FileSystem from 'expo-file-system';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { storage } from '../FirebaseConfig';
import { getAuth } from 'firebase/auth';

const EditProfile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const [selectedImage, setSelectedImage] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uploading, setUploading] = useState('false');

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setUsername(docSnap.data().username);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchUsername();
  }, [user]);
  

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  // const uploadMedia = async () => {
  //   setUploading(true);

  // try {
  //   const { uri } = await FileSystem.getInfoAsync(selectedImage);
  //   const blob = await new Promise((resolve, reject) => {
  //     const xhr = new XMLHttpRequest();
  //     xhr.onload = () => {
  //       resolve(xhr.response);
  //     };
  //     xhr.onerror = (e) => {
  //       reject(new TypeError('Network request failed'));
  //     };
  //     xhr.responseType = 'blob';
  //     xhr.open('GET', uri, true);
  //     xhr.send(null);
  //   });

//     const filename = selectedImage.substring(selectedImage.lastIndexOf('/') + 1);
//     const ref = app.storage().ref('profile pictures').child(filename);

//     await ref.put(blob);
//     setUploading(false);
//     Alert.alert('Photo Uploaded');
//     setSelectedImage(null);
//   } catch(error) {
//     console.error(error);
//     setUploading(false);
//   }
// }

//upload image files
async function uploadImage(uri, fileType) {
  const response = await fetch(uri);
  const blob = await response.blob();

  const storageRef = ref(storage, "Profile Pictures/" + new Date().getTime());
  const uploadTask = uploadBytesResumable(storageRef, blob);

  //listen for events
  uploadTask.on("state_changed",
    (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log("progress", progress + "% done");
    }, 
    (error) => {
      //handle error
    },
     () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log("File available at", downloadURL);
        await saveRecord(fileType, downloadURL, new Date().toISOString());
      })
     }
  )
}

async function saveRecord(fileType, url, createdAt) {
  try {
    const uid = user.uid;
    const userDoc = doc(db, 'users', user.uid)
    const docRef = await updateDoc(userDoc, {
      profilePicture: url
    });
    console.log("image saved correctly");
  } catch (e) {
    console.log(e)
  }
}

  return (
    <View style={styles.container}>
        <View style={styles.arrowContainer}>
          <Link href='/(tabs)/profile' asChild>
            <TouchableOpacity>
              <Ionicons 
                name={'chevron-back'}
                color={'black'}
                size={25}/>
            </TouchableOpacity>
          </Link>
        </View>
        <Text style={styles.header}>Edit Profile</Text>


      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={handleImageSelection}>
              <Image
              source={{ uri: selectedImage }}
              style={styles.profile} 
              />

              <View style={styles.cameraContainer}>
                <Ionicons 
                name={'camera'}
                color={'#696969'}
                size={30}
                opacity={0.8}
                />
                </View>
          </TouchableOpacity>
        
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.text}>Username</Text>
        <TextInput 
          value={username}
          onChangeText={value => setUsername(value)}
          editable={true}
          style={styles.input}
          />

        <Text style={styles.text}>Email</Text>
        <TextInput 
          value={email}
          onChangeText={value => setEmail(value)}
          editable={true}
          style={styles.input}
          />

        <Text style={styles.text}>Password</Text>
        <TextInput 
          value={password}
          onChangeText={value => setPassword(value)}
          editable={true}
          style={styles.input}
          secureTextEntry
          />
          
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: "#E9F7EF"
    },
    arrowContainer: {
      position: 'absolute',
      top: 60,
      left: 10
    },
    header: {
      marginTop: 65,
      fontSize: 18,
      fontWeight: 'bold'
    },
    profile: {
      width: 125,
      height: 125,
      borderRadius: 100,
      marginBottom: 10,
    },
    cameraContainer: {
      position: 'absolute',
      marginTop: 100,
      marginLeft: 90
    },
    profileContainer: {
      marginTop: 30
    },
    inputContainer: {
      alignItems: 'flex-start',
      justifyContent: 'center',
      
    },
    text: {
      marginTop: 30,
      fontSize: 15,
      fontWeight: 'bold'
    },
    input: {
      height: 40,
      width: 350,
      borderColor: '#fff',
      borderWidth: 1,
      borderRadius: 4,
      marginVertical: 10,
      justifyContent: 'center',
      paddingLeft: 8,
      backgroundColor: '#fff',
      fontSize: 15
    },
    button: {
      marginTop: 50,
      backgroundColor: "#397004",
      padding: 15,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      textAlign: "center",
      width: 350,
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 18
    }
})