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
      <Text style={{ color: "white", textAlign: 'center' }}>Choose User Avatar to Display</Text>
      <View style={styles.imagePickerStyle}>
        <MaterialIcons
          name="photo-camera"
          size={100}
          color="#0af"
          onPress={launchCamera}
        />
        <MaterialIcons
          name="photo-library"
          size={100}
          color="#0af"
          onPress={_pickImage}
        />
        <View>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatarStyle} />
          ) : null}
        </View>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  avatarStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  },
  imagePickerStyle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

export default AvatarPicker;
