import { useEffect, useRef, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  Button,
  Platform,
  TouchableOpacity,
  BackHandler,
} from "react-native";

import { StatusBar } from "expo-status-bar";
import { Video } from "expo-av";

import { Magnetometer } from "expo-sensors";

import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";

import { Ionicons } from "@expo/vector-icons";

const AdminDisplay = ({ navigation, route }) => {
  const video = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  // NavigationBarVisibility='hidden';
  const { bookData, tome } = route.params;
  const timeCode = [...bookData.timeCode];

  const [i, setI] = useState(0);
  const [code, setCode] = useState(timeCode[i][2] * 1000);
  const [reset, setReset] = useState(timeCode[i][1] * 1000);

  const [stateUser, setUser] = useState("user");

  // HIDE BOTTOM BAR ON ANDROID DEVICE
  useEffect(() => {
    const navigationBar = async () => {
      await NavigationBar.setVisibilityAsync("hidden");
    };
    {
      Platform.OS === "android" && navigationBar();
    }
  }, []);
  // QUIT VIDEO AND MAKE PORTRAIT_UP
  const back = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
  };
  const backAction = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.navigate("Story", {
      bookData: route.params.bookData,
      tome: route.params.tome,
    });
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    // navigation.goBack();
    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);
  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Video
        ref={video}
        style={styles.video}
        source={{ uri: bookData.video }}
        shouldPlay={true}
        positionMillis={0}
        useNativeControls={false}
        resizeMode="cover"
        progressUpdateIntervalMillis={1}
        onPlaybackStatusUpdate={(status) => {
          setTime(status.positionMillis);
          {
            i < timeCode.length - 1 &&
              time >= code &&
              video.current.playFromPositionAsync(reset);
          }
        }}
      />
      <TouchableOpacity
        style={styles.goBack}
        onPress={() => {
          back();
          navigation.navigate("Story", { bookData: bookData, tome: tome });
        }}>
        <Ionicons name="arrow-back-outline" size={22} color="white" />
      </TouchableOpacity>
      <View style={styles.ViewButtons}>
        <Button
          style={styles.button}
          title={isPlaying ? "Stop" : "Play"}
          onPress={() => {
            isPlaying
              ? video.current.pauseAsync() && setIsPlaying(!isPlaying)
              : video.current.playAsync() && setIsPlaying(!isPlaying);
          }}
        />
        <Button
          style={styles.button}
          title={i === timeCode.length - 1 ? "" : "next"}
          onPress={() => {
            setCode(timeCode[i + 1][2] * 1000);
            setReset(timeCode[i + 1][1] * 1000);
            {
              i + 1 === timeCode.length + 1 ? i : setI(i + 1);
            }
          }}
        />
        <Button
          style={styles.button}
          title={"prev"}
          onPress={() => {
            if (i > 0) {
              setCode(timeCode[i - 1][2] * 1000);
              setReset(timeCode[i - 1][1] * 1000);
              {
                i - 1 === timeCode.length - 1 ? i : setI(i - 1);
              }
            }
          }}
        />
        <Text
          style={{
            textAlign: "center",
            marginTop: 50,
            color: "rgb(226, 218, 210)",
          }}>
          {time}
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  video: {
    height: "100%",
    width: "90%",
    position: "relative",
  },
  goBack: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "white",
  },
  ViewButtons: {
    flex: 1,
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "space-around",
  },
});

export default AdminDisplay;
