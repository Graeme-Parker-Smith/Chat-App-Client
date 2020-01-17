import React, { useContext } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationEvents } from "react-navigation";
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";

const SignupScreen = () => {
  const [username, setusername] = useState("");
  const [password, setPassword] = useState("");
  const { state, signup, clearErrorMessage } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");

  return (
    <>
      <Spacer>
        <Text h3>{headerText}</Text>
      </Spacer>
      <Input
        label="username"
        value={username}
        onChangeText={setusername}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Spacer />
      <Input
        secureTextEntry
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <Spacer />
      <View>
        <Input
          label="avatar"
          value={avatar}
          onChangeText={setAvatar}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorMessage}>{errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title={submitButtonText}
          onPress={() => onSubmit({ username, password })}
        />
      </Spacer>
    </>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    header: null
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 200,
    backgroundColor: "#0AF"
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15
  }
});

export default SignupScreen;
