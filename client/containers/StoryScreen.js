import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import LottieView from "lottie-react-native";

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";

import { AntDesign, Ionicons } from "@expo/vector-icons";

const StoryScreen = ({ route, setSearchTitle, setShowSearchBar }) => {
  const navigation = useNavigation();
  const animation = useRef(null);

  // const [data, setData] = useState();
  const [seeMore, setSeeMore] = useState(false);

  // bookData single book
  const { bookData, tome } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: bookData.image,
          }}
          style={styles.img}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => {
            setShowSearchBar(false),
              setSearchTitle(""),
              navigation.navigate("AllStory", { tome: tome });
          }}>
          <View style={styles.bgdGoBack}>
            <Ionicons
              name="arrow-back-outline"
              size={22}
              color="rgb(165, 81, 69)"
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{bookData.title}</Text>
        <Text style={styles.author}>{bookData.author}</Text>
        <Text style={styles.duration}>{bookData.duration}sec</Text>
      </View>
      <ScrollView
        style={styles.synopsis}
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <Text style={styles.text}>{bookData.description}</Text>
      </ScrollView>
      {bookData.video ? (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("CountDown", {
              bookData: bookData,
              tome: tome,
            });
          }}
          style={styles.playContainer}>
          <AntDesign name="play" size={70} color="rgb(226, 218, 210)" />
        </TouchableOpacity>
      ) : (
        <View style={styles.lottieContainer}>
          <LottieView
            autoPlay={true}
            resizeMode="contain"
            loop={true}
            ref={animation}
            style={{
              height: 150,
              width: 120,
            }}
            source={require("../assets/grue-white.json")}
          />
        </View>
      )}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(165, 81, 69)",
  },
  imageContainer: {
    height: "40%",
    width: "100%",
    position: "relative",
    top: 0,
  },
  bgdGoBack: {
    height: 50,
    width: 50,
    borderRadius: 50,
    backgroundColor: "rgb(226, 218, 210)",
    alignItems: "center",
    justifyContent: "center",
  },
  goBack: {
    position: "absolute",
    left: 15,
    top: 10,
  },
  img: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  titleContainer: {
    height: "10%",
    paddingHorizontal: 30,
    alignItems: "center",
    justifyContent: "space-around",
    marginTop: 50,
  },
  title: {
    color: "rgb(226, 218, 210)",
    fontWeight: "bold",
    fontSize: 26,
    fontFamily: "casablanca",
  },
  author: {
    color: "rgb(226, 218, 210)",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "casablanca",
  },
  duration: {
    color: "rgb(226, 218, 210)",
    fontSize: 15,
    fontFamily: "casablanca",
  },
  lottieContainer: {
    alignItems: "center",
    marginBottom: 20,
    justifyContent: "center",
  },
  text: {
    marginTop: 30,
    paddingHorizontal: 30,
    fontSize: 15,
    color: "rgb(226, 218, 210)",
    height: "100%",
    textAlign: "justify",
  },
  synopsis: {
    height: "10%",
  },
  playContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    flex: 2,
  },
});
export default StoryScreen;
