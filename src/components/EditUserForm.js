import React, { useState } from "react";
import { View, StyleSheet, Image } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import Spacer from "./Spacer";
import AvatarPicker from "./AvatarPicker";

const EditUserForm = ({ currentUser, shouldShow, setShowEditUserForm }) => {
  // create reusable avatar picker form for signupscreen and editUserForm
  const [newUsername, setNewUsername] = useState(currentUser.username);
  const [newPassword, setNewPassword] = useState("");
  const [newAvatar, setNewAvatar] = useState(currentUser.avatar);

  const updateUser = () => {
    console.log("pressed update user button");
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
        />
      </Spacer>
      <AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} />
      <Spacer>
        <Button
          title="Update User Info"
          onPress={() => updateUser({ newUsername, newPassword, newAvatar })}
        />
        <Button title="Cancel" onPress={cancelEdit} />
      </Spacer>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 500,
    width: 500,
    backgroundColor: "white",
  }
});

export default EditUserForm;
