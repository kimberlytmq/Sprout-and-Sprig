import { Text, View, StyleSheet, Image, TouchableOpacity, Button } from "react-native";
import { Link, Redirect, router } from "expo-router";


export default function Index() {
  return (
      <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={styles.logo}/>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/log-in')} >
        <Text style={styles.buttonText} >Continue with Email</Text>
      </TouchableOpacity>
      
      {/*using this just to see home and the tabs for now, can rm later*/}
      <Link href="/search" style={styles.container}>Go to Main</Link>
    </View>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    marginTop: 100,
    resizeMode: "contain",
    height: 300,
    width: 300,
    alignSelf: "center"
  },
  button: {
    backgroundColor: "#397004",
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    textAlign: "center",
    width: 350,
    marginBottom: 10
  },
  buttonText: {
    fontWeight: "bold",
    fontSize: 20,
    color: "white"
  }

});
