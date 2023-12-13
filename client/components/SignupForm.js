import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";

import BouncyCheckbox from "react-native-bouncy-checkbox";
import Input from "./Input";
import { useState } from "react";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

const { height } = Dimensions.get("window");

const SignupForm = ({ setLogin, setUser, setStatut }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPasssword] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");
    if (username && email && password && confirmPassword && newsletter) {
      if (password === confirmPassword) {
        try {
          let expoToken;
          if (Device.isDevice) {
            const { status: existingStatus } =
              await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== "granted") {
              const { status } = await Notifications.requestPermissionsAsync();
              finalStatus = status;
            }
            if (finalStatus !== "granted") {
              alert("Failed to get push expoToken for push notification!");
              return;
            }
            expoToken = (await Notifications.getExpoPushTokenAsync()).data;
          } else {
            alert("Must use physical device for Push Notifications");
          }

          if (Platform.OS === "android") {
            Notifications.setNotificationChannelAsync("default", {
              name: "default",
              importance: Notifications.AndroidImportance.MAX,
              vibrationPattern: [0, 250, 250, 250],
              lightColor: "#FF231F7C",
            });
          }

          const response = await axios.post(
            //"http://backoffice-forest-admin-sr.herokuapp.com/user/signup",
            "http://localhost:3310/users",
            
            {
              username,
              email,
              password,
              newsletter,
              expoToken,
            }
          );

          setUser(response.data.token);
          setStatut(response.data.statut);
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrorMessage("Vos mots de passe ne sont pas identiques");
      }
    } else {
      setErrorMessage("Veuillez remplir tous les champs");
    }
    setIsLoading(false);
  };
  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <View style={styles.container}>
      {errorMessage !== "" && <Text style={styles.error}>{errorMessage}</Text>}
      <Input
        placeholder="Nom d'utilisateur"
        value={username}
        setState={setUsername}
      />
      <Input placeholder="Adresse e-mail" value={email} setState={setEmail} />
      <Input
        placeholder="Mot de passe"
        value={password}
        setState={setPassword}
        eye={true}
      />
      <Input
        placeholder="Confirmez votre mot de passe "
        value={confirmPassword}
        setState={setConfirmPasssword}
        eye={true}
      />

      <View style={styles.newsletterContainer}>
        <BouncyCheckbox
          onPress={() => setNewsletter(!newsletter)}
          fillColor="rgb(226, 218, 210)"
          style={{ paddingLeft: 5 }}
        />
        <View style={styles.newsletter}>
          <Text style={styles.newsletterText}>
            Abonnez-vous à notre newsletter pour être informé de nos nouveautés
            et offres
          </Text>
        </View>
      </View>
      <TouchableOpacity
        onPress={async () => {
          handleSubmit();
        }}
        style={styles.signupBtn}
      >
        <Text style={styles.textBtn}>Créer le compte</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setLogin((prevState) => !prevState);
        }}
      >
        <Text style={styles.text}>
          Vous avez déjà un compte ? Connectez-vous !
        </Text>
      </TouchableOpacity>
    </View>
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
  error: {
    textAlign: "center",
    fontSize: 13,
  },
  signupBtn: {
    paddingVertical: 8,
    width: "90%",
    alignItems: "center",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgb(226, 218, 210)",
  },
  textBtn: {
    color: "rgb(226, 218, 210)",
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    color: "rgb(226, 218, 210)",
  },
  newsletterContainer: {
    paddingVertical: 8,
    flexDirection: "row",
    width: "90%",
  },
  newsletter: {
    width: "80%",
    alignItems: "flex-end",
  },
  newsletterText: {
    color: "rgb(226, 218, 210)",
    fontSize: 12,
    paddingLeft: 10,
    textAlign: "justify",
  },
});
export default SignupForm;
