import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Button, Input } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { NavigationEvents } from "react-navigation";
import Spacer from "../components/Spacer";
import { ListItem } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as MessageContext } from "../context/MessageContext";
import SocketContext from "../context/SocketContext";
import { FontAwesome } from "@expo/vector-icons";

const RoomScreen = ({ navigation }) => {
  const roomName = navigation.getParam("roomName");
  const username = navigation.getParam("username");
  const [content, setContent] = useState("");
  const { state, fetchMessages, addMessage } = useContext(MessageContext);
  const socket = useContext(SocketContext);
  useEffect(() => {
    console.log("socket is: ", socket);
    socket.emit("join", { name: username, room: roomName }, error => {
      if (error) {
        alert(error);
      }
    });
  }, []);

  useEffect(() => {

    socket.on("message", ({user, text}) => {
      addMessage({creator: user, content: text, roomName})
    });
    console.log("[messages useEffect called]");

    // app slowing down and crashing after 10 messages sent...
    // caused by this return statement being in the first useEffect
    // hook rather than this one
    return () => {
      socket.emit("disconnect");

      socket.off();
      console.log("DISCONNECTING!!!");
      console.log("returning!!!");
    };
  }, [state]);

  // component does not unmount when navigating back to account screen, but remounts when re-navigating back into the room???

  return (
    <>
      <NavigationEvents onWillFocus={() => fetchMessages(roomName)} />
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontSize: 30 }}>
          Welcome to the {roomName} room! Your username is {username}
        </Text>
        <FlatList
          data={state}
          keyExtractor={item => item.time}
          renderItem={({ item }) => {
            return (
              <ListItem
                containerStyle={styles.channel}
                chevron
                title={item.content}
                titleStyle={styles.title}
              />
            );
          }}
        />
        <Input
          value={content}
          onChangeText={setContent}
          placeholder="Type Your message here"
        />
        <Button
          title="Send Message"
          onPress={() => addMessage({ creator: username, content, roomName })}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  channel: {
    backgroundColor: "rgba(228,60,63,1.0)",
    margin: 5,
    borderRadius: 10
  },
  title: {
    color: "white"
  }
});

export default RoomScreen;
