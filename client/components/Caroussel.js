import { useState, useEffect } from "react";
import axios from "axios";
import * as ScreenOrientation from "expo-screen-orientation";

import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";

import { MaterialIcons, Octicons } from "@expo/vector-icons";

const Caroussel = ({
  dataBooksAge,
  title,
  setPress,
  setBooksAgeList,
  navigation,
  setShowSearchBar,
  tome,
}) => {
  const [videoTest, setVideoTest] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const foo = async () => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.LANDSCAPE_LEFT
    );
  };

  useEffect(() => {
    const fetchTest = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          //"https://backoffice-forest-admin-sr.herokuapp.com/books/?title=boucledor"
          "http://localhost:3310/books/?title=boucledor"
        );
        setVideoTest(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error.message);
      }
      setIsLoading(false);
    };
    fetchTest();
  }, []);
  return dataBooksAge ? (
    <View style={styles.containerCarrousel}>
      <View style={styles.titleCarrouselContainer}>
        <TouchableOpacity
          style={styles.cardCarrousel}
          onPress={() => {
            setPress((prevState) => !prevState);
            setBooksAgeList(dataBooksAge);
          }}>
          <View style={styles.settingsContainer}>
            <Octicons
              style={styles.settingsIcon}
              name="dot-fill"
              size={12}
              color="black"
            />
            <Text style={styles.titleCarrousel}>{title}</Text>
          </View>

          <MaterialIcons
            name="navigate-next"
            size={24}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal={true}
        style={styles.carrousel}
        contentContainerStyle={{
          alignItems: "center",
        }}
        showsHorizontalScrollIndicator={false}>
        {dataBooksAge.map((book, index) => {
          return (
            <TouchableOpacity
              style={styles.itemCarrousel}
              key={index}
              activeOpacity={0.8}
              onPress={() => {
                setShowSearchBar(false);
                navigation.navigate("Story", { bookData: book, tome: tome });
              }}>
              <View style={styles.imageCarrouselContainer}>
                <Image style={styles.imageItem} source={{ uri: book.image }} />
              </View>
              <View style={styles.itemDescription}>
                <Text style={styles.itemText} numberOfLines={2}>
                  {book.title}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {isLoading ? (
          <Text>bientot</Text>
        ) : (
          videoTest && (
            <TouchableOpacity
              style={styles.itemCarrousel}
              activeOpacity={0.8}
              onPress={() => {
                setShowSearchBar(false);
                foo();
                navigation.navigate("TestDisplay", {
                  bookData: videoTest[0],
                  tome: tome,
                });
              }}>
              <View style={styles.imageCarrouselContainer}>
                <Image
                  style={styles.imageItem}
                  source={{ uri: videoTest[0].image }}
                />
              </View>
              <View style={styles.itemDescription}>
                <Text style={styles.itemText} numberOfLines={2}>
                  {videoTest[0].title}
                </Text>
              </View>
            </TouchableOpacity>
          )
        )}
      </ScrollView>
    </View>
  ) : null;
};
const styles = StyleSheet.create({
  settingsIcon: {
    color: "rgb(226, 218, 210)",
  },
  containerCarrousel: {
    marginTop: 20,
  },
  titleCarrouselContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    marginBottom: 20,
  },
  cardCarrousel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  settingsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  titleCarrousel: {
    color: "rgb(226, 218, 210)",
    marginLeft: 20,
    fontFamily: "casablanca",
    fontSize: 18,
  },
  carrousel: {
    marginLeft: 15,
    backgroundColor: "rgb(226, 218, 210)",
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    height: Dimensions.get("screen").height / 4.5,
  },
  itemCarrousel: {
    width: Dimensions.get("screen").width / 2.3,
    height: "85%",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  itemText: {
    color: "rgb(226, 218, 210)",
    fontFamily: "casablanca",
    fontSize: 15,
  },
  imageCarrouselContainer: {
    flex: 6,
    width: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  imageItem: {
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  itemDescription: {
    flex: 2,
    width: "100%",
    borderColor: "rgb(226, 218, 210)",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    padding: 3,
    backgroundColor: "rgb(165, 81, 69)",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default Caroussel;
