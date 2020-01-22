import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Input, Button } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { Context as ChannelContext } from "../context/ChannelContext";
import AvatarPicker from "../components/AvatarPicker";

const CreatePrivateChannelForm = ({ showForm }) => {
  const [newChannelName, setNewChannelName] = useState("");
  const { state, createPrivateChannel } = useContext(ChannelContext);
  const [avatar, setAvatar] = useState("");

  const cancelForm = () => {
    showForm(false);
  };

  const handleSubmit = () => {
    createPrivateChannel({
      name: newChannelName,
      creator: state.currentUser,
      avatar
    });
    setNewChannelName("");
    showForm(false);
  };
  return (
    <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
      <Input
        value={newChannelName}
        onChangeText={setNewChannelName}
        placeholder="Name your new Private channel"
        inputContainerStyle={{ marginBottom: 20 }}
        inputStyle={{ color: "#fff" }}
        placeholderTextColor="#fff"
        autoFocus={true}
      />
      <AvatarPicker
        avatar={avatar}
        setAvatar={setAvatar}
        whichForm={"Channel"}
      />
      <View style={styles.buttonRow}>
        <Button
          buttonStyle={styles.button}
          title="Create New Private Channel"
          onPress={handleSubmit}
        />
        <Button
          buttonStyle={styles.button}
          title="Cancel"
          onPress={cancelForm}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#301934"
  },
  button: {
    padding: 10
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around"
  }
});

export default CreatePrivateChannelForm;
