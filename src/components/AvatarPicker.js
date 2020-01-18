import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Input, Button, Text } from "react-native";
import Spacer from "./Spacer";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";

const AvatarPicker = ({ avatar, setAvatar }) => {
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
  );
};
const styles = StyleSheet.create({
  avatarStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
});

export default AvatarPicker;
