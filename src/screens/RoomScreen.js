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
import { FontAwesome } from "@expo/vector-icons";
import io from "socket.io-client";

const RoomScreen = ({ navigation }) => {
  const [content, setContent] = useState("");
  const { state, fetchMessages, addMessage } = useContext(MessageContext);
  const roomName = navigation.getParam("roomName");
  const username = navigation.getParam("username");

  const ENDPOINT = "http://192.168.1.233:3000";

  useEffect(() => {
    console.log("JOINING!!!");

    socket = io(ENDPOINT);

    socket.emit("join", { name: username, room: roomName }, error => {
      if (error) {
        alert(error);
      }
    });
  }, [state]);

  useEffect(() => {
    console.log("JOINING!!!");

    socket = io(ENDPOINT);

    socket.emit("join", { name, room }, error => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT]);

  useEffect(() => {
    // socket.on("message", message => {
    //   setMessages([...messages, message]);
    // });
    // console.log("[messages useEffect called]");

    // app slowing down and crashing after 10 messages sent...
    // caused by this return statement being in the first useEffect
    // hook rather than this one
    return () => {
      socket.emit("disconnect");

      socket.off();
      // console.log("DISCONNECTING!!!");
      // console.log("returning!!!");
    };
  }, [state]);

  return (
    <>
      <NavigationEvents onWillFocus={fetchMessages} />
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
        <Button title="Send Message" onPress={() => addMessage({username, content, roomName})} />
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
