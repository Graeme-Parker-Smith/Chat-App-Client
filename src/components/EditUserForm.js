import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { Context as ChannelContext } from "../context/ChannelContext";
import { Context as AuthContext } from "../context/AuthContext";
import Spacer from "./Spacer";
import AvatarPicker from "./AvatarPicker";

const EditUserForm = ({ shouldShow, setShowEditUserForm, setIsLoading }) => {
  const {
    state: { currentUser },
    updateUser,
    fetchChannels
  } = useContext(ChannelContext);
  const { tryLocalSignin } = useContext(AuthContext);
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(currentUser.avatar);

  const updateThenReset = async () => {
    setIsLoading(true);
    await updateUser({
      username: currentUser.username,
      newUsername,
      newPassword,
      newAvatar
    });
    setShowEditUserForm(false);
    await fetchChannels();
    setIsLoading(false);
  };

  const cancelEdit = () => {
    setShowEditUserForm(false);
  };

  return (
    <View
      style={[styles.container, { display: shouldShow ? "block" : "none" }]}
    >
      <Text style={{ color: "white" }}>Edit User Info</Text>
      <Spacer>
        <Input
          label="Edit Username"
          value={newUsername}
          onChangeText={setNewUsername}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ color: "white" }}
        />
      </Spacer>
      <Spacer>
        <Input
          secureTextEntry
          label=" Edit Password"
          value={newPassword}
          onChangeText={setNewPassword}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ color: "white" }}
        />
      </Spacer>
      <AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} />
      <Spacer>
        <Button title="Update User Info" onPress={() => updateThenReset()} />
        <Button title="Cancel" onPress={cancelEdit} />
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    width: Dimensions.get("window").width,
    backgroundColor: "#000"
  }
});

export default EditUserForm;
