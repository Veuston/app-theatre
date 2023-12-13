import React, { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useFonts } from "expo-font";

//Import librairies navigation. Default Theme => stylyser toutes l'app avec une const Theme
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as NavigationBar from "expo-navigation-bar";
import * as Notifications from "expo-notifications";

// Import containers Screen
import SettingsScreen from "./containers/SettingsScreen";
import HomeScreen from "./containers/HomeScreen";
import StoryScreen from "./containers/StoryScreen";
import AfficheScreen from "./containers/AfficheScreen";
import AllStoryScreen from "./containers/AllStorysScreen";
import CountDownScreen from "./containers/CountdownScreen";

import UserDisplay from "./containers/UserDisplay";
import AdminDisplay from "./containers/AdminDisplay";
import TestDisplay from "./containers/TestDisplay";

const Stack = createNativeStackNavigator();

const App = () => {
  const [loaded] = useFonts({
    casablanca: require("./assets/fonts/casablanca-medium.ttf"),
  });
  const [userToken, setUserToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // state search bar
  const [searchTitle, setSearchTitle] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(true);

  // state User information
  const [userStatut, setUserStatut] = useState();

  const setUser = async (token) => {
    token
      ? await AsyncStorage.setItem("userToken", token)
      : await AsyncStorage.removeItem("userToken");
    setUserToken(token);
  };

  const setStatut = async (statut) => {
    statut
      ? await AsyncStorage.setItem("statut", statut)
      : await AsyncStorage.removeItem("statut");
    setUserStatut(statut);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userToken = await AsyncStorage.getItem("userToken");
      const statut = await AsyncStorage.getItem("statut");
      setUserToken(userToken);
      setUserStatut(statut);
      setIsLoading(false);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const colorBottomBar = async () => {
      if (Platform.OS === "android") {
        await NavigationBar.setBackgroundColorAsync("rgb(165, 81, 69)");
      }
    };
    colorBottomBar();
  }, []);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (isLoading === true) {
    return null;
  } else if (!loaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}>
        {!userToken ? (
          <>
            <Stack.Screen name="Home">
              {(props) => (
                <HomeScreen
                  {...props}
                  setUser={setUser}
                  setUserStatut={setUserStatut}
                  userStatut={userStatut}
                  setStatut={setStatut}
                />
              )}
            </Stack.Screen>
          </>
        ) : (
          <>
            {/* <Stack.Screen name="Animation" component={AnimationTest} /> */}

            <Stack.Screen name="Affiche">
              {(props) => (
                <AfficheScreen
                  {...props}
                  setUser={setUser}
                  setShowSearchBar={setShowSearchBar}
                  setSearchTitle={setSearchTitle}
                  userStatut={userStatut}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="AllStory">
              {(props) => (
                <AllStoryScreen
                  {...props}
                  setUser={setUser}
                  searchTitle={searchTitle}
                  setSearchTitle={setSearchTitle}
                  showSearchBar={showSearchBar}
                  setShowSearchBar={setShowSearchBar}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="Story">
              {(props) => (
                <StoryScreen
                  {...props}
                  setUser={setUser}
                  searchTitle={searchTitle}
                  setSearchTitle={setSearchTitle}
                  setShowSearchBar={setShowSearchBar}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="CountDown">
              {(props) => (
                <CountDownScreen {...props} userStatut={userStatut} />
              )}
            </Stack.Screen>

            <Stack.Screen name="Settings">
              {(props) => (
                <SettingsScreen
                  {...props}
                  setUser={setUser}
                  setStatut={setStatut}
                />
              )}
            </Stack.Screen>

            {/* <Stack.Screen name="Display" component={DisplayScreen} /> */}

            {/* <Stack.Screen name="Curtain" component={Curtain} /> */}

            <Stack.Screen name="AdminDisplay" component={AdminDisplay} />
            <Stack.Screen name="TestDisplay" component={TestDisplay} />
            <Stack.Screen name="UserDisplay" component={UserDisplay} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default App;
