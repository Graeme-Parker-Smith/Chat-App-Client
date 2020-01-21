import React, { useState, useContext } from "react";
import { View, StyleSheet, Image, Dimensions } from "react-native";
import { Input, Button, Text } from "react-native-elements";
import { Context as ChannelContext } from "../context/ChannelContext";
import { Context as AuthContext } from "../context/AuthContext";
import Spacer from "./Spacer";
import AvatarPicker from "./AvatarPicker";

const EditChannelForm = ({ showForm, setIsLoading, thisName, thisAvatar }) => {
  const {
    state: { currentUser },
    updateChannel,
    fetchChannels
  } = useContext(ChannelContext);
  const { tryLocalSignin } = useContext(AuthContext);
  const [newName, setNewName] = useState(thisName);
  const [newAvatar, setNewAvatar] = useState(thisAvatar);

  const handleSubmit = async () => {
    setIsLoading(true);
    await updateChannel({
      username: currentUser.username,
      name: newName,
      avatar: newAvatar
    });
    showForm(false);
    await fetchChannels();
    setIsLoading(false);
  };

  const cancelForm = () => {
    showForm(false);
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "white" }}>Edit Channel Info</Text>
      <Spacer>
        <Input
          label="Edit Channel Name"
          value={newName}
          onChangeText={setNewName}
          autoCapitalize="none"
          autoCorrect={false}
          inputStyle={{ color: "white" }}
        />
      </Spacer>
      <AvatarPicker avatar={newAvatar} setAvatar={setNewAvatar} />
      <Spacer />
      <View style={styles.buttonRow}>
        <Button
          buttonStyle={styles.button}
          title="Update Channel Info"
          onPress={handleSubmit}
        />
        <Button
          buttonStyle={styles.button}
          title="Cancel"
          onPress={cancelForm}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: "#000"
  },
  button: {
    padding: 10
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

export default EditChannelForm;
