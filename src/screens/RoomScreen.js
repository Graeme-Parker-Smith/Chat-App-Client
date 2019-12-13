import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  memo,
  useMemo
} from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard
} from "react-native";
import { Button, Input, ListItem } from "react-native-elements";
import { NavigationEvents, withNavigationFocus } from "react-navigation";
import Spacer from "../components/Spacer";
import { Context as MessageContext } from "../context/MessageContext";
import SocketContext from "../context/SocketContext";
import uuid from "uuid/v4";
import MessageItem from "../components/MessageItem";
import KeyboardShift from '../components/KeyBoardShift';

const RoomScreen = ({ navigation, isFocused }) => {
  console.log("Rendering ROOMSCREEN!!!!!!");
  const scrollViewRef = useRef();
  const didMountRef = useRef(false);
  const socket = useContext(SocketContext);
  const roomName = navigation.getParam("roomName");
  const username = navigation.getParam("username");
  // socket.emit("disconnect") is a special event. It cannot be used like a custom event like socket.emit("leave") or socket.emit("whatever")
  useEffect(() => {
    if (didMountRef.current) {
      if (!isFocused) socket.emit("leave", { room: roomName });
      console.log("emitting leave");
    } else {
      didMountRef.current = true;
    }
  }, [isFocused]);
  const [content, setContent] = useState("");
  const { state, fetchMessages, addMessage, addQuickMessage } = useContext(
    MessageContext
  );
  useEffect(() => {
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

  const sendNewMessage = () => {
    const messageToSend = { creator: username, content, roomName };
    socket.emit("sendMessage", messageToSend);
    setContent("");
  };
  return (
    <>
      <NavigationEvents onWillFocus={() => fetchMessages(roomName)} />
      <KeyboardShift>
        <View style={{ marginTop: 10 }}>
          <Text style={{ marginLeft: 20, fontSize: 40 }}>User: {username}</Text>
          <Text style={{ marginLeft: 20, fontSize: 20 }}>@{roomName}</Text>
          <View>
            <ScrollView
              style={{ height: 400 }}
              ref={scrollViewRef}
              onContentSizeChange={(contentWidth, contentHeight) => {
                scrollViewRef.current.scrollToEnd({ animated: true });
              }}
            >
              <FlatList
                data={state}
                keyExtractor={item => uuid()}
                renderItem={({ item }) => {
                  return (
                    <MessageItem
                      content={item.content}
                      username={item.creator}
                      time={item.time}
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
      </KeyboardShift>
    </>
  );
};

export default memo(withNavigationFocus(RoomScreen));
