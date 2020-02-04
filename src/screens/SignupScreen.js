import React, { useContext, useState } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Text, Button, Input } from "react-native-elements";
import Spacer from "../components/Spacer";
// import { NavigationEvents } from "react-navigation";
import { SafeAreaView } from "react-navigation";
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import AvatarPicker from "../components/AvatarPicker";

const SignupScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, signup, clearErrorMessage } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");

  const _next = () => {
    _passwordInput && _passwordInput.focus();
  }

  // const _toPassword = () => {
  //   _passwordInput && _passwordInput.focus();
  // }

  // const _submit = () => {

  // }

  return (
    <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
      <Spacer>
        <Text style={{ color: "white" }} h3>
          Sign Up
        </Text>
      </Spacer>
      <Input
        label="username"
        value={username}
        onChangeText={setUsername}
        autoFocus={true}
        autoCapitalize="none"
        autoCorrect={false}
        inputStyle={{ color: "white" }}
        returnKeyType="next"
        selectTextOnFocus={true}
        ref={ref => _usernameInput = ref}
        onSubmitEditing={_next}
      />
      <Spacer />
      <Input
        
        label="Password"
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        autoCorrect={false}
        inputStyle={{ color: "white" }}
        returnKeyType="next"
        selectTextOnFocus={true}
        ref={ref => _passwordInput = ref}
      />
      <Spacer />
      <AvatarPicker avatar={avatar} setAvatar={setAvatar} whichForm={"User"} />
      {state.errorMessage ? (
        <Text style={styles.errorMessage}>{state.errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title="Register User"
          onPress={() => signup({ username, password, avatar: avatar.base64Uri })}
        />
      </Spacer>
      <NavLink routeName="Signin" text="Go back to Sign In" />
    </SafeAreaView>
  );
};

SignupScreen.navigationOptions = () => {
  return {
    header: null
  };
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#000",
    color: "white"
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    marginLeft: 15,
    marginTop: 15
  }
});

export default SignupScreen;
