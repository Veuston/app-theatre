import React from "react";
import { useState, useEffect, useRef } from "react";
import LottieView from "lottie-react-native";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Dimensions,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import Constants from "expo-constants";

// Import librairies : axios /
import axios from "axios";

// Import components : caroussel / list (quand modal recherche activée)
import Caroussel from "../components/Caroussel";
import ListStory from "../components/ListStory";
import SearchResult from "../components/SearchResultScreen";

// Import icones
import { Ionicons, Entypo } from "@expo/vector-icons";

const AllStoryScreen = ({
  navigation,
  route,
  searchTitle,
  setSearchTitle,
  setShowSearchBar,
  showSearchBar,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // state array books by ageCategory :
  const [dataBooksAge1, setDataBooksAge1] = useState(); // - 1-3 ans
  const [dataBooksAge3, setDataBooksAge3] = useState(); // - 3-5 ans
  const [dataBooksAge5, setDataBooksAge5] = useState(); // - 5-7 ans

  // data
  const [books, setBooks] = useState();
  const { tome } = route.params;

  // navigation
  // list / Age screen ListStory
  const [press, setPress] = useState(false);
  const [booksAgeList, setBooksAgeList] = useState();

  // search state
  const [searchResults, setSearchResults] = useState([]);

  // animation
  const animation = useRef(new Animated.Value(0)).current;
  const animationShrink = useRef(new Animated.Value(0)).current;

  const growBar = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
    }).start();
  };
  const shrinkBar = () => {
    Animated.timing(animationShrink, {
      toValue: 1,
      duration: 500,
    }).start();
  };

  const interpolateGrow = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["15%", "90%"],
  });

  const interpolateShrink = animationShrink.interpolate({
    inputRange: [0, 1],
    outputRange: ["80%", "15%"],
  });

  useEffect(() => {
    if (showSearchBar) {
      growBar();
      animationShrink.setValue(0);
    } else if (!showSearchBar) {
      shrinkBar();
      animation.setValue(0);
    }
  }, [showSearchBar]);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      try {
        const responseBooks = await axios.get(
          //`https://backoffice-forest-admin-sr.herokuapp.com/books/`
          "http://localhost:3310/books"
        );

        const resultBooks = responseBooks.data;
        setBooks(resultBooks);

        const arrayAge1 = [];
        const arrayAge3 = [];
        const arrayAge5 = [];

        resultBooks.map((item) => {
          if (item.ageCategory === "1-3") {
            arrayAge1.push(item);
          } else if (item.ageCategory === "3-5") {
            arrayAge3.push(item);
          } else {
            arrayAge5.push(item);
          }

          setDataBooksAge1(arrayAge1);
          setDataBooksAge3(arrayAge3);
          setDataBooksAge5(arrayAge5);
        });
      } catch (error) {
        console.log(error.message);
      }
      setShowSearchBar(false);
      animationShrink.setValue(1);
      setSearchTitle("");
      setIsLoading(false);
    };
    getData();
  }, []);

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 1000,
    }).start();
  };

  useEffect(() => {
    fadeIn();
  }, [fadeAnim]);
  const lottie = useRef(null);
  return isLoading ? (
    <View style={styles.lottieContainer}>
      <LottieView
        autoPlay={true}
        resizeMode="contain"
        ref={lottie}
        style={styles.lottieLoading}
        source={require("../assets/Mask.json")}
        onAnimationFinish={() => {
          setIsLoading(false);
        }}
      />
    </View>
  ) : (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={showSearchBar ? { width: "1%" } : styles.openSearchBar}
          onPress={() => {
            navigation.navigate("Affiche");
          }}>
          <Ionicons
            name="arrow-back-outline"
            size={22}
            color={"rgb(165, 81, 69)"}
          />
        </TouchableOpacity>
        <Animated.View
          style={[
            showSearchBar ? styles.showModal : styles.hiddenModal,
            showSearchBar
              ? { width: interpolateGrow }
              : { width: interpolateShrink },
          ]}>
          <TouchableOpacity
            onPress={() => {
              setShowSearchBar(true);
            }}>
            <KeyboardAvoidingView
              behavior={Platform.OS === "android" ? "position" : "padding"}
              contentContainerStyle={styles.viewSearch}
              style={styles.viewSearch}>
              <Entypo
                style={styles.icons}
                name="magnifying-glass"
                size={24}
                color="black"
              />

              <TextInput
                style={
                  showSearchBar
                    ? {
                        marginLeft: 10,
                        color: "rgb(226, 218, 210)",
                      }
                    : { display: "none" }
                }
                placeholder="Titre de l'oeuvre"
                onChangeText={(v) => {
                  setSearchTitle(v);
                }}
                placeholderTextColor={"rgb(226, 218, 210)"}
                value={searchTitle}
              />
            </KeyboardAvoidingView>
          </TouchableOpacity>
        </Animated.View>
      </View>

      {route.params && !searchTitle && (
        <TouchableOpacity
          style={styles.selected}
          activeOpacity={1}
          onPress={() => {
            setShowSearchBar(false);
            setSearchTitle("");
          }}>
          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: tome.image }}
              resizeMode="contain"
            />
          </View>

          <View style={styles.description}>
            <Text style={styles.textDescription}>{tome.title}</Text>
            <Text style={styles.textDescription}>Tome : {tome.tome}</Text>
          </View>
        </TouchableOpacity>
      )}

      <ScrollView
        onStartShouldSetResponder={() => {
          setShowSearchBar(false);
        }}
        contentContainerStyle={{ flexGrow: 1 }}>
        {searchTitle ? (
          <View style={styles.carousselView}>
            <SearchResult
              title={searchTitle}
              navigation={navigation}
              searchResults={searchResults}
              setSearchResults={setSearchResults}
              setShowSearchBar={setShowSearchBar}
              tome={tome}
              setSearchTitle={setSearchTitle}
            />
          </View>
        ) : (
          dataBooksAge1 &&
          dataBooksAge3 &&
          dataBooksAge5 &&
          (press ? (
            <View>
              <ListStory
                setPress={setPress}
                booksAgeList={booksAgeList}
                navigation={navigation}
                setShowSearchBar={setShowSearchBar}
                tome={tome}
              />
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
              <Caroussel
                setPress={setPress}
                title="Adaptés aux 1-3 ans"
                dataBooksAge={dataBooksAge1}
                setBooksAgeList={setBooksAgeList}
                navigation={navigation}
                setShowSearchBar={setShowSearchBar}
                tome={tome}
              />
              <Caroussel
                setPress={setPress}
                title="Adaptés aux 3-5 ans"
                dataBooksAge={dataBooksAge3}
                booksAgeList={booksAgeList}
                setBooksAgeList={setBooksAgeList}
                navigation={navigation}
                setSearchResults={setSearchResults}
                setShowSearchBar={setShowSearchBar}
                tome={tome}
              />
              <Caroussel
                setPress={setPress}
                title="Adaptés aux 5-7 ans"
                dataBooksAge={dataBooksAge5}
                booksAgeList={booksAgeList}
                setBooksAgeList={setBooksAgeList}
                navigation={navigation}
                setSearchResults={setSearchResults}
                setShowSearchBar={setShowSearchBar}
                tome={tome}
              />
            </ScrollView>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  lottieContainer: {
    flex: 1,
    backgroundColor: "rgb(165, 81, 69)",
    justifyContent: "center",
    alignItems: "center",
  },
  lottieLoading: {
    height: 200,
    width: 200,
    backgroundColor: "rgb(165, 81, 69)",
  },
  container: {
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "rgb(165, 81, 69)",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    height: Dimensions.get("screen").height / 9,
  },

  openSearchBar: {
    backgroundColor: "rgb(226, 218, 210)",
    borderRadius: 50,
    padding: 15,
    color: "rgb(165, 81, 69)",
  },

  viewSearch: {
    height: "70%",
    flexDirection: "row",
    alignItems: "center",
  },

  showModal: {
    height: "60%",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "rgba(226, 218, 210,0.5)",
    borderRadius: 50,
    paddingLeft: 5,
    flexDirection: "row",
  },
  hiddenModal: {
    height: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(226, 218, 210,0.5)",
    borderRadius: 50,
    flexDirection: "row",
  },

  icons: {
    color: "rgb(226, 218, 210)",
  },
  selected: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomColor: "rgb(226, 218, 210)",
    marginTop: 20,
    borderBottomWidth: 1,
    marginHorizontal: 20,
    height: "15%",
    // width: Dimensions.get("screen").width - Dimensions.get("screen").width / 4,
    paddingBottom: 10,
  },

  imageContainer: {
    width: "25%",
    height: "90%",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  description: {
    justifyContent: "flex-end",
    width: "60%",
    height: "90%",
  },
  textDescription: {
    color: "rgb(226, 218, 210)",
    fontSize: 20,
    marginVertical: 5,
    fontFamily: "casablanca",
  },
});

export default AllStoryScreen;
