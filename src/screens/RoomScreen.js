import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Button, Input, ListItem } from "react-native-elements";
import { NavigationEvents, withNavigationFocus } from "react-navigation";
import Spacer from "../components/Spacer";
import { Context as MessageContext } from "../context/MessageContext";
import SocketContext from "../context/SocketContext";
import uuid from "uuid/v4";


const RoomScreen = ({ navigation, isFocused }) => {
  const socket = useContext(SocketContext);
  const roomName = navigation.getParam("roomName");
  const username = navigation.getParam("username");
  // socket.emit("disconnect") is a special event. It cannot be used like a custom event like socket.emit("leave") or socket.emit("whatever")
  useEffect(() => {
    if (!isFocused) socket.emit("leave", { room: roomName });
    console.log("emitting leave");
  }, [isFocused]);
  const [content, setContent] = useState("");
  const { state, fetchMessages, addMessage, addQuickMessage } = useContext(
    MessageContext
  );
  useEffect(() => {
    // console.log("socket is: ", socket);
    socket.emit("join", { name: username, room: roomName }, error => {
      if (error) {
        console.log(error);
      }
    });
    console.log("Mounting");
  }, []);

  useEffect(() => {
    socket.on("message", ({ user, text }) => {
      const newMessage = { creator: user, content: text, roomName };
      console.log("receiving message: ", newMessage);
      addQuickMessage(newMessage);
      if (user === username) addMessage(newMessage);
    });

    // app slowing down and crashing after 10 messages sent...
    // caused by this return statement being in the first useEffect
    // hook rather than this one
    return () => {
      socket.emit("disconnect");

      socket.off();
      console.log("Unmounting");
    };
  }, [state]);

  // component does not unmount when navigating back to account screen, but remounts when re-navigating back into the room???

  const sendNewMessage = () => {
    const messageToSend = { creator: username, content, roomName };
    socket.emit("sendMessage", messageToSend);
  };
  return (
    <>
      <NavigationEvents onWillFocus={() => fetchMessages(roomName)} />
      <View style={{ marginTop: 50 }}>
        <Text style={{ fontSize: 30 }}>
          Welcome to the {roomName} room! Your username is {username}
        </Text>
        <View>
          <ScrollView style={{ height: 400 }}>
            <FlatList
              data={state}
              keyExtractor={item => uuid()}
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
          </ScrollView>
        </View>
        <Input
          value={content}
          onChangeText={setContent}
          placeholder="Type Your message here"
        />
        <Button title="Send Message" onPress={sendNewMessage} />
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

export default withNavigationFocus(RoomScreen);
