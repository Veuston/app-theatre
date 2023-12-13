import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useState } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Constants from "expo-constants";
import { useRef, useEffect } from "react";
import SignupForm from "../components/SignupForm";
import LoginForm from "../components/LoginForm";

import LottieView from "lottie-react-native";

const { width, height } = Dimensions.get("window");


const HomeScreen = ({ setUser, setStatut }) => {

  const [modal, setModal] = useState(false);
  const [login, setLogin] = useState(true);
  const animation = useRef(null);
  const [mask, setMask] = useState(true);
  const [count, setCount] = useState(3);
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
  return mask ? (

    <View style={styles.lottieContainer}>

      <LottieView
        autoPlay={true}
        resizeMode="contain"
        loop={count ? true : false}
        ref={animation}
        style={{
          height: 200,
          width: 200,
          backgroundColor: "rgb(165, 81, 69)",
        }}
        source={require("../assets/Mask.json")}
        onAnimationFinish={() => {
          setMask(false);
        }}
      />
    </View>
  ) : (
    <KeyboardAwareScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          style={styles.img}
          source={require("../assets/img/titre.png")}
          resizeMode="contain"
        />
      </View>
      {!modal ? (
        <View style={styles.homeBlock}>
          <Text style={styles.homeText}>Votre première fois ?</Text>
          <TouchableOpacity
            style={styles.signupBtn}
            onPress={() => {
              setModal(true);
              setLogin(false);
            }}>
            <Text style={styles.textSignupBtn}>S'inscrire</Text>
          </TouchableOpacity>
          <Text style={styles.homeText}>J'ai mes habitudes !</Text>
          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() => {
              setModal(true);
              setLogin(true);
            }}>
            <Text style={styles.textLoginBtn}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          {login ? (
            <LoginForm
              setLogin={setLogin}
              setUser={setUser}
              setStatut={setStatut}
            />
          ) : (
            <SignupForm
              setLogin={setLogin}
              setUser={setUser}
              setStatut={setStatut}
            />
          )}
        </>
      )}
    </KeyboardAwareScrollView>
  );
};
const styles = StyleSheet.create({
  lottieContainer: {
    flex: 1,
    backgroundColor: "rgb(165, 81, 69)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "rgb(165, 81, 69)",
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 20,
    width: width,
    height: height,
  },
  header: {
    height: height / 2.5,
    width: "100%",
    justifyContent: "center",
  },
  img: {
    height: "80%",
    width: "100%",
  },
  homeBlock: {
    marginTop: height / 4,
    alignItems: "center",
    justifyContent: "center",
    height: height / 5,
  },
  homeText: {
    fontSize: 12,
    color: "rgb(226, 218, 210)",
    paddingVertical: 10,
  },
  signupBtn: {
    backgroundColor: "rgb(226, 218, 210)",
    paddingVertical: 8,
    width: "90%",
    alignItems: "center",
    borderRadius: 15,
  },
  loginBtn: {
    paddingVertical: 8,
    width: "90%",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgb(226, 218, 210)",
  },

  textSignupBtn: {
    color: "rgb(165, 81, 69)",
    fontSize: 14,
  },
  textLoginBtn: {
    color: "rgb(226, 218, 210)",
    fontSize: 14,
  },
});
export default HomeScreen;
