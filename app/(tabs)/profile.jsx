import { View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native'
import { Link } from "expo-router";
import React, { useEffect, useState } from 'react'
import { db } from '../../FirebaseConfig'
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { BottomTabBarHeightCallbackContext } from '@react-navigation/bottom-tabs';
import { useAuth } from '../../context/authContext';
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { SimpleLineIcons } from '@expo/vector-icons';


const achievementsCriteria = [
  { id: 1, description: "Saved your first plant pin on the map", check: (pins, plants) => pins.length >= 1},
  { id: 2, description: "Saved 5 plant pins on the map", check: (pins, plants) => pins.length >= 5},
  { id: 3, description: "Saved 10 plant pins on the map", check: (pins, plants) => pins.length >= 10},
  { id: 4, description: "Saved your first plant to the Biodex", check: (pins, plants) => plants.length >= 1},
  { id: 5, description: "Saved 5 plants to the Biodex", check: (pins, plants) => plants.length >= 5},
  { id: 6, description: "Saved 10 plants to the Biodex", check: (pins, plants) => plants.length >= 10}

]


const Profile = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [profilePicture, setProfilePicture] = useState('https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png');
  const [achievements, setAchievements] = useState([])
  const auth = getAuth();
  const user = auth.currentUser;


  // fetch username from firebase
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

  // fetch email from firebase
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

  // fetch profile picture from firebase
  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        if (user) {
          const userDoc = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            setProfilePicture(docSnap.data().profilePicture);
          } else {
            console.log('No such document!');
          }
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchProfilePicture();
  }, [user]);
  
  // fetch achievements from Firestore
  useEffect(() => {
    if (user) {
      const achievementsDoc = doc(db, 'achievements', user.uid);
      const unsubscribe = onSnapshot(achievementsDoc, (doc) => {
        if (doc.exists()) {
          setAchievements(doc.data().achievements || []);
        } else {
          console.log('No such document!');
        }
      });
  
      return () => unsubscribe();
    }
  }, [user]);
  

  // access pins and plants from firebase
  useEffect(() => {
    if (user) {
      const pinsDoc = doc(db, 'pins', user.uid);
      const unsubscribePins = onSnapshot(pinsDoc, (pinsSnapshot) => {
        if (pinsSnapshot.exists()) {
          const pins = pinsSnapshot.data().pins;
          const plantsDoc = doc(db, 'plants', user.uid);
          const unsubscribePlants = onSnapshot(plantsDoc, (plantSnapshot) => {
            if (plantSnapshot.exists()) {
              const plants = plantSnapshot.data().plants;
              checkAchievements(pins, plants);
            } else {
              console.log('No such document for plants!');
            }
          });
        } else {
          console.log('No such document for pins!');
        }
      });

      // Cleanup the listener on component unmount
      return () => unsubscribePins();
    }
  }, [user]);

  /*
  useEffect(() => {
    if (user) {
        const plantsDoc = doc(db, 'plants', user.uid);
        const unsubscribe = onSnapshot(plantsDoc, (doc) => {
            if (doc.exists()) {
                checkAchievements(doc.data().plants);
            } else {
                console.log('No such document!');
            }
        });

        // Cleanup the listener on component unmount
        return () => unsubscribe();
    }
  }, [user]);
  */

  // check if achievements should be given
  const checkAchievements = async (pins, plants) => {
    const newAchievements = [];
    for (const achievement of achievementsCriteria) {
      if (achievement.check(pins, plants) && !achievements.some(a => a.id === achievement.id)) {
        newAchievements.push({ id: achievement.id, description: achievement.description });
      }
    }
    if (newAchievements.length > 0) {
      const updatedAchievements = [...achievements, ...newAchievements]
      setAchievements(updatedAchievements);
      await updateAchievements(updatedAchievements);
    }
  }
  
  // update achievements
  const updateAchievements = async (newAchievements) => {
    try {
      const achievementsDoc = doc(db, 'achievements', user.uid);
      await updateDoc(achievementsDoc, {achievements: newAchievements});
      console.log('Achievements updated in Firestore')
    } catch (error) {
      console.error('Error updating achievements: ', error);
    }
  };

  const { logout } = useAuth();
  const handleLogout = async ()=>{
    await logout();
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
          <Image
            source={{ uri: profilePicture }}
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
      <View style={styles.achievements}>
        {achievements.map((achievement) => (
          <View key={achievement.id} style={styles.achievementContainer}>
            <SimpleLineIcons name="badge" size={24} color='#397004' marginRight={10}/>
            <Text style={styles.achievementText}>{achievement.description}</Text>
          </View>
        ))}
      </View>

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
    color: '#397004',
    fontWeight: 'bold'
  },
  cameraContainer: {
    position: 'absolute',
    marginTop: 80,
    marginLeft: 70
  },
  achievements: {
    padding: 15
  },
  achievementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  achievementText: {
    fontSize: 18,
    color: '#397004',
    marginBottom: 5,
  }
});
