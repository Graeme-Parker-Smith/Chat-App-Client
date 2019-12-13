import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import Spacer from "./Spacer";
import { Entypo } from "@expo/vector-icons";

const Avatar = () => <Entypo name="user" size={20} />;

const MessageItem = ({ content, username, time }) => {
  return (
    <ListItem
      containerStyle={styles.messageBody}
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
    backgroundColor: "rgba(228,60,63,1.0)",
    margin: 5,
    borderRadius: 10
  },
  title: {
    color: "#d3d3d3",
    fontSize: 20
  },
  subtitle: {
    color: "white"
  }
});

export default MessageItem;
