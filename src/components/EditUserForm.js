import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Input, Button, Text } from "react-native";
import Spacer from "./Spacer";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";

const EditUserForm = ({ currentUser }) => {
  // create reusable avatar picker form for signupscreen and editUserForm
  const [newAvatar, setNewAvatar] = useState("");

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    console.log(result);

    if (!result.cancelled) {
      setNewAvatar(result.uri);
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
      setNewAvatar(result.uri);
    }
  };

  return (
    <View>
      <Text>Edit User Info</Text>
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
        <Text>Choose A New Avatar For Your Account</Text>
        <View>
          {newAvatar ? (
            <Image source={{ uri: newAvatar }} style={styles.avatarStyle} />
          ) : (
            <Image
              source={{ uri: currentUser.avatar }}
              style={styles.avatarStyle}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  avatarStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
});

export default EditUserForm;
