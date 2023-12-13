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
import LottieView from "lottie-react-native";

import { Magnetometer } from "expo-sensors";

import * as ScreenOrientation from "expo-screen-orientation";
import * as NavigationBar from "expo-navigation-bar";
import StoryScreen from "./StoryScreen";

import { Ionicons } from "@expo/vector-icons";

import { AntDesign } from "@expo/vector-icons";

export default function TestDisplay({ navigation, route }) {
    const video = useRef(null);
    // const animation = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [time, setTime] = useState(0);
    const { bookData } = route.params;
  
    const startData = [...bookData.timeCode]; 
    const fillTab = () => {
        let index = 0;
        let tab = [];
        while (index < startData.length ){                                      //boucle tant que l'index est inferieur au tableau regroupant toutes les scenes
            let addTab = [];                                                    //creation tableau vide qui sera fill avec des sequences entree boucle sortie
            index === 0 && addTab.push(0);                                      //premier tour entree ou pas on commence par start : 0 
            ///////START///////////////////
            if (startData[index][0].start)                                     //Si la key start existe dans la data on la rentre dans addTab comme premier element du tableau
                addTab.push(startData[index][0].start );
            else if (!startData[index][0].start && index !== 0)                //Sinon start === exit de la sequence precedente
                addTab.push(tab[index - 1][2]);
            ////////BOUCLE/////////////////
            if (startData[index][0].boucle)                                    //Si la key boucle existe dans la data on la rentre dans addTab comme second element du tableau
                addTab.push(startData[index][0].boucle);
            else if (!startData[index][0].boucle)                              //Sinon boucle === start de la sequence en cours   
                    addTab.push(addTab[0]);
            ///////////////EXIT//////////////////
            if (startData[index][0].exit)                                      //Si la key exit existe dans la data on la rentre dans addTab comme dernier element du tableau
                addTab.push(startData[index][0].exit);
            else if (!startData[index][0].exit){                                //si exit n'existe pas
                if (startData[index + 1][0].start)                              //exit === start de la sequence suivante
                    addTab.push(startData[index + 1][0].start);
                else if (startData[index + 1][0].boucle)                        //sinon exit === boucle de la sequence suivante
                    addTab.push(startData[index + 1][0].boucle)
                else if (startData[index + 1][0].exit)                          //sinon exit === exit de la sequence suivante
                    addTab.push(startData[index + 1][0].exit)
            } 
            tab.push(addTab);                                                   //on push addTab dans notre tableau final regroupant chaque sequence
            index++;                                                            //on passe a la sequence suivante
        }
        return (tab);                                                           //on retourne notre tableau final
    }

    const timeCode = fillTab();
    // console.log("timeCode :::: ", timeCode);
    const [i, setI] = useState(0);
    const [code, setCode] = useState(timeCode[i][2] * 1000);
    const [reset, setReset] = useState(timeCode[i][1] * 1000);
  
    const [stateUser, setUser] = useState("user");
    const [stepForward, setStepForward] = useState(false);
    const [finish, setFinish] = useState(false);
    // const animation = useRef(null);
  
    const [data, setData] = useState({
      x: 0,
      y: 0,
      z: 0,
    });
  
    // USE MAGNET TO GO TO NEXT SCENE
    useEffect(() => {
      const magnetFunction = async () => {
        Magnetometer.setUpdateInterval(1000);
        Magnetometer.addListener((result) => {
          setData(result);
        });
  
        if (data.z > 600) {
          // alert("COUCOU");
          setStepForward(true);
          setCode(timeCode[i + 1][2] * 1000);
          setReset(timeCode[i + 1][1] * 1000);
  
          {
            i + 1 === timeCode.length ? setI(timeCode.length) : setI(i + 1);
          }
        }
      };
      magnetFunction();
      return () => {
        Magnetometer.removeAllListeners();
        setStepForward(false);
      };
    }, [data]);
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
      const handleFinish = () => {
        setFinish(true);
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
        // {{ uri: "https://res.cloudinary.com/dpcwqnqtf/video/upload/v1653117283/Video/Cendrillon_video.mp4",}}
        shouldPlay={true}
        positionMillis={0}
        useNativeControls={false}
        resizeMode="cover"
        progressUpdateIntervalMillis={1}
        onPlaybackStatusUpdate={(status) => {
          setTime(status.positionMillis);
          {
            //   console.log("time ::: ", time);
            //   console.log("code :::: " , code);
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
          navigation.navigate("Story", {
            bookData: route.params.bookData,
            tome: route.params.tome,
          });
        }}>
        <Ionicons name="arrow-back-outline" size={22} color="white" />
      </TouchableOpacity>

      <View style={stepForward && { position: "absolute", top: 10, right: 10 }}>
        <AntDesign name="stepforward" size={22} color="white" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  animationContainer: {
    backgroundColor: "#000000",

    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  container: {
    backgroundColor: "#000000",
    flex: 1,
  },
  video: {
    height: "100%",
    width: "100%",
    position: "relative",
  },
  goBack: {
    position: "absolute",
    top: 10,
    left: 10,
    color: "white",
  },
});