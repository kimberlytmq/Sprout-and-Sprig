import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { Link } from "expo-router";
import React, { useEffect, useState } from 'react'
import { db } from '../../FirebaseConfig'
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/authContext';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import EditProfile from '../editProfile';
import * as ImagePicker from "expo-image-picker";


const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  const navigation = useNavigation();

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

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setEmail(docSnap.data().email);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchEmail();
  }, [user]);


  const { logout } = useAuth();
  const handleLogout = async ()=>{
    await logout();
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
          <Image
            source={{ uri: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png' }}
            style={styles.profile} 
          />

        <Text style={styles.title}>{username}</Text>
        <View style={styles.emailContainer}>
          <Ionicons 
           name={"mail-outline"}
           color={"#FFF"}
           size={20}
           />
           <Text style={styles.email}>{email}</Text>
        </View>
        <Link href="/editProfile" asChild>
          <TouchableOpacity style={styles.editProfileButton} >
            <Text style={styles.editProfileText}>Edit profile</Text>
          </TouchableOpacity>
        </Link>
        
        
      </View>
      <Text style={styles.subtitle}>Achievements</Text>
      <Text style={styles.subtitle}>Photos</Text>
      <TouchableOpacity style={styles.button} onPress={handleLogout} >
        <Text style={styles.buttonText} >Logout</Text>
      </TouchableOpacity> 
      
    </View>
  )
}


export default Profile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E9F7EF",

  },
  header: {
    height: 300,
    paddingTop: 50,
    backgroundColor: '#397004',
    justifyContent: 'center',
    alignItems : 'center',
  },
  title: {
    fontWeight: "bold",
    fontSize: 35,
    color: "white",
    marginBottom: 5
  },
  subtitle: {
    fontWeight: "bold",
    fontSize: 25,
    color: '#397004',
    marginTop: 15,
    marginLeft: 10,
    marginBottom: 15
  },
  button: {
    backgroundColor: "#397004",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    width: 100,
    marginBottom: 15,
    marginTop: 15,
    marginLeft: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 18,
    color: "white"
  },
  profile: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10
  },
  email: {
    color: "#FFF",
    fontSize: 15,
    marginLeft: 5
  },
  editProfileButton: {
    backgroundColor: "#D4EFDF",
    padding: 10,
    borderRadius: 15,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editProfileText: {
    color: "#397004",
    fontWeight: 'bold'
  },
  cameraContainer: {
    position: 'absolute',
    marginTop: 80,
    marginLeft: 70
  },
});
