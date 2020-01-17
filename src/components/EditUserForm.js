import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button } from "react-native";

const EditUserForm = () => {
  const [newAvatar, setNewAvatar] = useState("");
  return (
    <View>
      <Input />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  }
});

export default EditUserForm;
