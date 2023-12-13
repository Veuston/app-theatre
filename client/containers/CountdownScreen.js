import React from "react";
import { useEffect, useState } from "react";
import * as ScreenOrientation from "expo-screen-orientation";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { Entypo } from "@expo/vector-icons";

const CountDownScreen = ({ navigation, route, userStatut }) => {
  const [count, setCount] = useState(10);

  const { bookData, tome } = route.params;
  useEffect(() => {
    const countDown = setInterval(() => {
      setCount((prevState) =>
        prevState > 0 ? prevState - 1 : (prevState = 0)
      );
    }, 1000);
    return () => {
      clearInterval(countDown);
    };
  }, []);

  const foo = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  };

  useEffect(() => {
    if (count === 0) {
      foo();

      if (userStatut === "admin") {
        navigation.navigate("AdminDisplay", {
          bookData: bookData,
          tome: tome,
        });
      } else {
        navigation.navigate("UserDisplay", {
          bookData: bookData,
          tome: tome,
        });
      }
    }
  }, [count]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => {
            navigation.navigate("Story", { bookData: bookData, tome: tome });
          }}>
          <Entypo name="cross" size={22} color="rgb(165, 81, 69)" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>La représentation va commencer</Text>
      </View>
      <View style={styles.main}>
        <View style={styles.textView}>
          <Text style={styles.text}>
            Pendant que nos acteurs se préparent placez votre téléphone dans le
            réceptacle situé à l'arrière de votre théâtre, puis débuter votre
            lecture sans précipitation
          </Text>
        </View>
        <View style={styles.textView}>
          <Text style={{ fontSize: 100, color: "rgb(226, 218, 210)" }}>
            {count}
          </Text>
        </View>
      </View>
      <View style={styles.textView}>
        <Text style={styles.lastText}>Bon spectacle à tous</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgb(165, 81, 69)",
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "flex-end",
    paddingHorizontal: 10,
  },
  goBack: {
    backgroundColor: "rgb(226, 218, 210)",
    borderRadius: 50,
    padding: 15,
    color: "rgb(165, 81, 69)",
  },
  titleContainer: {
    alignItems: "center",
    marginTop: 100,
  },
  title: {
    fontSize: 20,
    textTransform: "uppercase",
    color: "rgb(226, 218, 210)",
    fontFamily: "casablanca",
  },
  main: {
    alignItems: "center",
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    color: "rgb(226, 218, 210)",
    lineHeight: 35,
  },
  textView: {
    alignItems: "center",
    marginTop: 30,
  },
  lastText: {
    fontSize: 30,
    textTransform: "uppercase",
    color: "rgb(226, 218, 210)",
    marginTop: 30,
    fontFamily: "casablanca",
  },
});

export default CountDownScreen;
