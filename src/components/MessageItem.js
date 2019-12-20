import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import Spacer from "./Spacer";
import { Entypo } from "@expo/vector-icons";

const Avatar = () => <Entypo name="user" size={20} color="#0af" />

const MessageItem = ({ content, username, time }) => {
  // console.log("MESSAGEITEM RENDERED!!!")
  return (
    <ListItem
      containerStyle={username === "Admin" ? {...styles.messageBody, backgroundColor: 'green'} : styles.messageBody}
      title={"from: " + username + " at..." + time}
      titleStyle={styles.title}
      subtitle={content}
      subtitleStyle={styles.subtitle}
      leftAvatar={Avatar}
    ></ListItem>
  );
};

const styles = StyleSheet.create({
  messageBody: {
    backgroundColor: "black",
    padding: 5,
    height: 45,
  },
  title: {
    color: "#0af",
    fontSize: 18
  },
  subtitle: {
    color: "white"
  }
});

export default memo(MessageItem);
