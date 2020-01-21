import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Input, Button } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { Context as ChannelContext } from "../context/ChannelContext";

const CreateChannelForm = () => {
  const [newChannelName, setNewChannelName] = useState("");
  const { state, createChannel } = useContext(ChannelContext);

  const handleSubmit = () => {
    createChannel({ name: newChannelName, creator: state.currentUser });
    setNewChannelName("");
  };
  return (
    <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
      <Input
        value={newChannelName}
        onChangeText={setNewChannelName}
        placeholder="Name your new channel"
        inputStyle={{ color: "#fff" }}
        placeholderTextColor="#fff"
      />
      <Button title="Create New Channel" onPress={handleSubmit} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#000"
  }
});

export default CreateChannelForm;
