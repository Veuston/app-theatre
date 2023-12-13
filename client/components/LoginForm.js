import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
//import * as Facebook from "expo-facebook";
//import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
WebBrowser.maybeCompleteAuthSession();

import axios from "axios";
import Input from "./Input";

const { height } = Dimensions.get("window");

const LoginForm = ({ setLogin, setUser, setStatut }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  //connnexion par e-mail
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    if (email && password) {
      try {
        const response = await axios.post(
          //"https://backoffice-forest-admin-sr.herokuapp.com/user/login",
          "http://localhost:3310/user/login",
          {
            email,
            password,
          }
        );
        setUser(response.data.token);
        setStatut(response.data.statut);
      } catch (error) {
        setErrorMessage("Votre adresse email ou mot de passe est incorrect");
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
    }
    setIsLoading(false);
  };
  /* //connexion via facebook
  const facebookLogIn = async () => {
    try {
      await Facebook.initializeAsync({
        appId: "375681944623587",
      });
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ["public_profile"],
      });
      if (type === "success") {
        fetch(`https://graph.facebook.com/me?access_token=${token}`)
          .then((response) => response.json())
          .then((data) => {
            setUser(token);
          })
          .catch((e) => console.log(e));
      } else {
        //type === "cancel"
      }
    } catch ({ message }) {
      alert(`Facebook login error : ${message}`);
    }
  };
  // connexion via google
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId:
      "649247833998-lfjpf4d7u6kse8abm0kil78d9emf49uf.apps.googleusercontent.com",
  });
  useEffect(() => {
    if (response?.type === "success") {
      setUser(response.authentication.accessToken);
    }
  }, [response]); */

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <>
      <View style={styles.container}>
{/*         <View style={styles.ggLoginContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/img/logo-gg.png")}
          />
          <TouchableOpacity
            onPress={() => {
              promptAsync();
            }}
          >
            <Text style={styles.ggLoginText}>Se connecter avec Google</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.fbLoginContainer}>
          <Image
            style={styles.logo}
            source={require("../assets/img/logo-fb.png")}
          />
          <TouchableOpacity onPress={facebookLogIn}>
            <Text style={styles.fbLoginText}>Se connecter avec Facebook</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.brkLineContainer}>
          <Text style={styles.brkLineText}>Ou connectez-vous par e-mail</Text>
        </View>
        {errorMessage !== "" && (
          <Text style={styles.error}>{errorMessage}</Text>
        )}
        <Input placeholder="Adresse e-mail" value={email} setState={setEmail} />
        <Input
          placeholder="Mot de passe"
          value={password}
          setState={setPassword}
          eye={true}
        />
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={async () => {
            handleSubmit();
          }}
        >
          <Text style={styles.textBtn}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setLogin((prevState) => !prevState);
          }}
        >
          <Text style={styles.text}>
            Vous n'avez pas encore de compte ? Inscrivez-vous !
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    height: height / 2,
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 6,
    width: "100%",
  },
  logo: {
    width: 20,
    height: 20,
    marginStart: 5,
  },
  ggLoginContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "90%",
    borderRadius: 3,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  ggLoginText: {
    marginEnd: 47,
    fontSize: 14,
  },
  fbLoginContainer: {
    backgroundColor: "#38569E",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    width: "90%",
    borderRadius: 3,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  fbLoginText: {
    color: "rgb(226, 218, 210)",
    marginEnd: 30,
    fontSize: 14,
  },
  brkLineContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "rgb(226, 218, 210)",
    height: 10,
    width: "90%",
    position: "relative",
    alignItems: "center",
    marginVertical: 15,
  },
  brkLineText: {
    position: "absolute",
    backgroundColor: "rgb(165, 81, 69)",
    paddingHorizontal: 5,
    color: "rgb(226, 218, 210)",
  },
  error: {
    textAlign: "center",
    fontSize: 13,
  },
  loginBtn: {
    paddingVertical: 8,
    width: "90%",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgb(226, 218, 210)",
    marginTop: height / 20,
    shadowOffset: { width: 3, height: 3 },
    shadowOpacity: 0.3,
  },
  textBtn: {
    color: "rgb(226, 218, 210)",
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    color: "rgb(226, 218, 210)",
  },
});
export default LoginForm;
