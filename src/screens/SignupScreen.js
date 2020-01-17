import React, { useContext, useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Text, Button, Input } from "react-native-elements";
import Spacer from "../components/Spacer";
import { NavigationEvents } from "react-navigation";
import { Context as AuthContext } from "../context/AuthContext";
import AuthForm from "../components/AuthForm";
import NavLink from "../components/NavLink";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";

const SignupScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { state, signup, clearErrorMessage } = useContext(AuthContext);
  const [avatar, setAvatar] = useState("");

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };
  const launchCamera = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      setAvatar(result.uri);
    }
  };

  return (
    <>
      <Spacer>
        <Text h3>Sign Up</Text>
      </Spacer>
      <Input
        label="username"
        value={username}
        onChangeText={setUsername}
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
        <MaterialIcons
          name="photo-camera"
          size={32}
          color="#0af"
          onPress={launchCamera}
        />
        <MaterialIcons
          name="photo-library"
          size={32}
          color="#0af"
          onPress={_pickImage}
        />
        <Text>Choose User Avatar to Display</Text>
        <View>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarStyle} />
          ) : null}
        </View>
      </View>
      {state.errorMessage ? (
        <Text style={styles.errorMessage}>{state.errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title="Register User"
          onPress={() => signup({ username, password, avatar })}
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
  },
  avatarStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
});

export default SignupScreen;
