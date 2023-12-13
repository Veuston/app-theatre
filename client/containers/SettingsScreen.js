import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";

// Import Constants package expo : fournit information sur appareil.
import Constants from "expo-constants";

// Import icones
import {
  Ionicons,
  Entypo,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  Fontisto,
  EvilIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = ({ navigation, setUser, setStatut }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.goBack}
          onPress={() => {
            navigation.goBack();
          }}>
          <Ionicons
            name="arrow-back-outline"
            size={16}
            color={"rgb(165, 81, 69)"}
          />
        </TouchableOpacity>

        <Text style={styles.title}>Paramètres</Text>

        <TouchableOpacity
          onPress={() => {
            setUser(null);
            setStatut(null);
          }}>
          <Entypo
            style={styles.settingsIcon}
            name="login"
            size={20}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <View style={styles.settingsBlock}>
          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <FontAwesome5
                style={styles.settingsIcon}
                name="user-circle"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>
                Connexion / Créer un compte
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <MaterialIcons
                style={styles.settingsIcon}
                name="volume-up"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>
                Ajuster le volumes maximum
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <MaterialCommunityIcons
                style={styles.settingsIcon}
                name="content-save-outline"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>Gérer les téléchargements</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsBlock}>
          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <FontAwesome
                style={styles.settingsIcon}
                name="star"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>Evaluez-nous</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <Ionicons
                style={styles.settingsIcon}
                name="share-social"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>Invitez un ami</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <AntDesign
                style={styles.settingsIcon}
                name="unlock"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>
                Entrez un code de référence
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsBlock}>
          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <Feather
                style={styles.settingsIcon}
                name="help-circle"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>Assistance</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <Entypo
                style={styles.settingsIcon}
                name="email"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>
                Pour les mots d'amour... ou pas
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <MaterialIcons
                style={styles.settingsIcon}
                name="settings"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>Paramètre du compte</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingsButton}>
            <View style={styles.lineSettings}>
              <MaterialCommunityIcons
                style={styles.settingsIcon}
                name="scale-balance"
                size={24}
                color="black"
              />
              <Text style={styles.settingsText}>Légal</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.resauContainer}>
        <TouchableOpacity style={styles.buttonCircle}>
          <Fontisto style={styles.settingsIcon} name="instagram" size={24} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonCircleFacebook}>
          <EvilIcons style={styles.settingsIcon} name="sc-facebook" size={30} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    // paddingHorizontal: 20,
    justifyContent: "space-between",
    backgroundColor: "rgb(165, 81, 69)",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginTop: 20,
  },
  goBack: {
    backgroundColor: "rgb(226, 218, 210)",
    borderWidth: 1,
    borderRadius: 50,
    padding: 15,
    color: "rgb(165, 81, 69)",
    borderWidth: 0,
  },
  title: {
    textTransform: "uppercase",
    color: "rgb(226, 218, 210)",
  },
  main: {
    paddingHorizontal: 30,
    marginTop: "-15%",
  },
  settingsBlock: {
    marginTop: 20,
  },
  settingsButton: {
    marginTop: 10,
  },
  lineSettings: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsText: {
    fontSize: 19,
    marginLeft: 25,
    color: "rgb(226, 218, 210)",
    fontFamily: "casablanca",
  },
  settingsIcon: {
    color: "rgb(226, 218, 210)",
  },
  resauContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 30,
    width: "40%",
    justifyContent: "space-around",
  },
  buttonCircle: {
    borderColor: "rgb(226, 218, 210)",
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
  },
  buttonCircleFacebook: {
    borderColor: "rgb(226, 218, 210)",
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    marginLeft: 20,
  },
});

export default SettingsScreen;
