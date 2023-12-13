import { TextInput, StyleSheet } from "react-native";
const Input = ({ placeholder, setState, value, eye }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      placeholderTextColor="rgb(226, 218, 210)"
      onChangeText={(text) => setState(text)}
      value={value}
      secureTextEntry={eye ? true : false}
      autoCapitalize="none"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    width: "90%",
    color: "rgb(226, 218, 210)",
    borderBottomWidth: 1,
    borderColor: "rgb(226, 218, 210)",
    fontSize: 12,
    paddingVertical: 6,
  },
});
export default Input;
