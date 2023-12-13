import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { MaterialIcons, Octicons } from "@expo/vector-icons";

const ListStory = ({
  setPress,
  booksAgeList,
  navigation,
  setShowSearchBar,
  tome,
}) => {
  return (
    <View style={styles.listContainer}>
      <View style={styles.listTitleContainer}>
        <View style={styles.tagAgeContainer}>
          <Octicons
            style={styles.icons}
            name="dot-fill"
            size={12}
            color="black"
          />
          <Text style={styles.listTitle}>
            Adaptés aux {booksAgeList[0].ageCategory} ans
          </Text>
        </View>
        <TouchableOpacity
          style={styles.toCarrouselButton}
          onPress={() => {
            setPress((prevState) => !prevState);
          }}>
          <Text style={styles.toCarrouselText}>Revenir</Text>
          <MaterialIcons name="navigate-next" size={24} style={styles.icons} />
        </TouchableOpacity>
      </View>
      <View contentContainerStyle={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-around",
            marginTop: 10,
            paddingHorizontal: 10,
            height: 500,
          }}>
          {booksAgeList.map((book, index) => {
            return (
              <TouchableOpacity
                style={styles.listItem}
                key={index}
                activeOpacity={0.7}
                onPress={() => {
                  setShowSearchBar(false);
                  navigation.navigate("Story", { bookData: book, tome: tome });
                }}>
                <View style={styles.containerImageItemList}>
                  <Image
                    style={styles.imageItem}
                    source={{ uri: book.image }}
                    resizeMode={"cover"}
                  />
                </View>
                <View style={styles.itemListDescription}>
                  <Text style={styles.itemListText} numberOfLines={1}>
                    {book.title}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  toCarrouselButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  toCarrouselText: {
    color: "rgb(226, 218, 210)",
    fontFamily: "casablanca",
    fontSize: 18,
  },
  listTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  tagAgeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  listTitle: {
    color: "rgb(226, 218, 210)",
    marginLeft: 20,
    fontFamily: "casablanca",
    fontSize: 18,
  },
  listItem: {
    margin: 10,
    height: "33%",
    width: "44%",
  },
  containerImageItemList: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 4,
  },
  imageItem: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "110%",
    width: "100%",
  },
  itemListDescription: {
    borderColor: "rgb(165, 81, 69)",
    borderWidth: 1,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: "rgb(226, 218, 210)",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    padding: 3,
  },
  itemListText: {
    color: "rgb(165, 81, 69)",
    fontFamily: "casablanca",
    fontSize: 18,
  },
  icons: {
    color: "rgb(226, 218, 210)",
  },
});
export default ListStory;
