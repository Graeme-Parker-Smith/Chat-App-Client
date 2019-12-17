import React, { memo } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { ListItem } from "react-native-elements";
import Spacer from "./Spacer";
import { Entypo } from "@expo/vector-icons";

const Avatar = () => <Entypo name="user" size={20} />;

const MessageItem = ({ content, username, time }) => {
  // console.log("MESSAGEITEM RENDERED!!!")
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
    backgroundColor: "#0af",
    margin: 2,
    padding: 5,
    borderRadius: 10,
    height: 45,
  },
  title: {
    color: "#d3d3d3",
    fontSize: 18
  },
  subtitle: {
    color: "white"
  }
});

export default memo(MessageItem);
