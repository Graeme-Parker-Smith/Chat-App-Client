import React, { useState, useContext } from "react";
import { View, StyleSheet, Text, Dimensions } from "react-native";
import { Input, Button } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { Context as ChannelContext } from "../context/ChannelContext";

const CreateChannelForm = ({ showForm }) => {
  const [newChannelName, setNewChannelName] = useState("");
  const { state, createChannel } = useContext(ChannelContext);

  const cancelForm = () => {
    showForm(false);
  };

  const handleSubmit = () => {
    createChannel({ name: newChannelName, creator: state.currentUser });
    setNewChannelName("");
    showForm(false);
  };
  return (
    <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
      <Input
        value={newChannelName}
        onChangeText={setNewChannelName}
        placeholder="Name your new channel"
        inputContainerStyle={{ marginBottom: 20 }}
        inputStyle={{ color: "#fff" }}
        placeholderTextColor="#fff"
      />
      <View style={styles.buttonRow}>
        <Button
          buttonStyle={styles.button}
          title="Create New Channel"
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

export default CreateChannelForm;
