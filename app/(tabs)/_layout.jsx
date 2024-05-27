import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";

export default function Layout(){
  return(
    <Tabs screenOptions={{
      headerShown: false,
      tabBarShowLabel: false,
      tabBarStyle: {
        position: "absolute",
        bottom: 27,
        left: 16, 
        right: 16, 
        height: 72,
        elevation: 0,
        backgroundColor: "white",
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
      }
    }}>
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused })=>(
            <View style={{
              alignItems: "center",
              paddingTop: 10
            }}>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={focused ? "#718355" : "black"}
                size={24}
              />
              <Text style={{
                color: focused ? "#718355" : "black",
                fontSize: 12,
                marginTop: 4
              }}>Home</Text>
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused })=>(
            <View style={{
              alignItems: "center",
              paddingTop: 10
            }}>
              <Ionicons
                name={focused ? "search" : "search-outline"}
                color={focused ? "#718355" : "black"}
                size={24}
              />
              <Text style={{
                color: focused ? "#718355" : "black",
                fontSize: 12,
                marginTop: 4
              }}>Search</Text>
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          tabBarIcon: ({ focused })=>(
            <View style={{
              alignItems: "center",
              paddingTop: 10
            }}>
              <Ionicons
                name={focused ? "camera" : "camera-outline"}
                color={focused ? "#718355" : "black"}
                size={24}
              />
              <Text style={{
                color: focused ? "#718355" : "black",
                fontSize: 12,
                marginTop: 4
              }}>Camera</Text>
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused })=>(
            <View style={{
              alignItems: "center",
              paddingTop: 10
            }}>
              <Ionicons
                name={focused ? "book" : "book-outline"}
                color={focused ? "#718355" : "black"}
                size={24}
              />
              <Text style={{
                color: focused ? "#718355" : "black",
                fontSize: 12,
                marginTop: 4
              }}>Index</Text>
            </View>
          )
        }}
      />

      <Tabs.Screen
        name="map"
        options={{
          tabBarIcon: ({ focused })=>(
            <View style={{
              alignItems: "center",
              paddingTop: 10
            }}>
              <Ionicons
                name={focused ? "location" : "location-outline"}
                color={focused ? "#718355" : "black"}
                size={24}
              />
              <Text style={{
                color: focused ? "#718355" : "black",
                fontSize: 12,
                marginTop: 4
              }}>Map</Text>
            </View>
          )
        }}
      />





    </Tabs>
  )
}
