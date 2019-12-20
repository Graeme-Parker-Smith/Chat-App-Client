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
import {
  NavigationEvents,
  withNavigationFocus,
  SafeAreaView
} from "react-navigation";
import Spacer from "../components/Spacer";
import { Context as MessageContext } from "../context/MessageContext";
import SocketContext from "../context/SocketContext";
import uuid from "uuid/v4";
import MessageItem from "../components/MessageItem";
import KeyboardShift from "../components/KeyBoardShift";

const RoomScreen = ({ navigation, isFocused }) => {
  let listHeight = 200;

  const scrollViewRef = useRef();
  const didMountRef = useRef(false);
  const socket = useContext(SocketContext);
  const roomName = navigation.getParam("roomName");
  const username = navigation.getParam("username");
  // socket.emit("disconnect") is a special event. It cannot be used like a custom event like socket.emit("leave") or socket.emit("whatever")
  useEffect(() => {
    if (didMountRef.current) {
      if (!isFocused) socket.emit("leave", { room: roomName });
    } else {
      didMountRef.current = true;
    }
  }, [isFocused]);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [endScrollPosition, setEndScrollPosition] = useState(0);
  const [users, setUsers] = useState([]);
  const {
    state,
    fetchMessages,
    addMessage,
    addQuickMessage,
    fetchEarlierMessages
  } = useContext(MessageContext);
  useEffect(() => {
    socket.emit("join", { name: username, room: roomName }, error => {
      if (error) {
        console.log(error);
      }
    });
  }, []);

  useEffect(() => {
    socket.on("message", ({ user, text }) => {
      const newMessage = { creator: user, content: text, roomName };
      addQuickMessage(newMessage);
      if (user === username) addMessage(newMessage, state);
      handleAutoScroll();
    });

    socket.on("roomData", ({ users }) => {
      const userNames = users.map(u => u.name);
      setUsers(userNames);
    });
    // app slowing down and crashing after 10 messages sent...
    // caused by this return statement being in the first useEffect
    // hook rather than this one
    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [state, users]);

  const sendNewMessage = () => {
    const messageToSend = { creator: username, content, roomName };
    socket.emit("sendMessage", messageToSend);
    setContent("");
  };

  const renderItemOutside = (item, index) => {
    // console.log("current index is :", index);
    return (
      <MessageItem
        content={item.content}
        username={item.creator}
        time={item.time}
      />
    );
  };
  const keyExtractor = item => (item._id ? item._id : uuid());

  // scroll functions
  const scrollToBottom = () => {
    if (scrollViewRef.current.scrollToEnd) {
      console.log("SCROLL TO BOTTOM FIRED!");
      scrollViewRef.current.scrollToEnd({ animated: true });
    } else {
      console.log("scrollToBottom failed.");
    }
  };
  const handleScroll = async e => {
    setScrollPosition(e.nativeEvent.contentOffset.y);
    // console.log("scroll event CONTENT OFFSET: ", e.nativeEvent.contentOffset);

    // e.nativeEvent.contentOffset.y < 1 tells us if user has scrolled to top
    if (e.nativeEvent.contentOffset.y < 1 && loading === false) {
      setLoading(true);
      // console.log("FETCH EARLIER MESSAGES");
      await fetchEarlierMessages(state, roomName);
      scrollViewRef.current.scrollToIndex({
        index: 11,
        viewOffset: 100,
        viewPosition: 0,
        animated: false
      });
      setTimeout(() => {
        setLoading(false);
        console.log("LOADING IS DONE");
      }, 100);
    }
  };
  const handleAutoScroll = (width, height) => {
    // console.log("width", width);
    // console.log("height", height);
    if (scrollPosition >= endScrollPosition) {
      console.log("FIRING SCROLL TO BOTTOM");
      scrollViewRef.current.scrollToEnd({ animated: true });
      setEndScrollPosition(scrollPosition);
      console.log("END SCROLL POS: ", endScrollPosition);
    }
  };

  // const isCloseToBottom = ({
  //   layoutMeasurement,
  //   contentOffset,
  //   contentSize
  // }) => {
  //   const paddingToBottom = 20;
  //   return (
  //     layoutMeasurement.height + contentOffset.y >=
  //     contentSize.height - paddingToBottom
  //   );
  // };

  // const onLayout = () => {
  //   if (scrollViewRef.current) {
  //     setTimeout(() => {
  //       console.log("state.length: ", state.length);
  //       scrollViewRef.current.scrollToIndex({
  //         index: -1,
  //         animated: false,
  //         viewPosition: 1
  //       });
  //     }, 500);
  //   }
  // };
  const handleOnFocus = async () => {
    await fetchMessages(roomName);
    console.log("state.length after fetch messages is: ", state.length);
    scrollToBottom();
  };
  let userList = users.reduce((total, value) => {
    return total + ", " + value;
  }, []);
  // console.log("state", state);
  return (
    <>
      <NavigationEvents onWillFocus={handleOnFocus} />
      <KeyboardShift style={styles.body} messages={state}>
        <View
          onLayout={handleAutoScroll}
          style={{ marginTop: 10, backgroundColor: "#000" }}
        >
          <Text style={{ marginLeft: 20, fontSize: 40, color: "#fff" }}>
            User: {username}
          </Text>
          <Text style={{ marginLeft: 20, fontSize: 20, color: "#fff" }}>
            @{roomName} ({users.length} users online): {userList}
          </Text>
          {scrollPosition < endScrollPosition - 2 ? (
            <Button
              buttonStyle={{ height: 40, backgroundColor: "orange" }}
              title="Jump to Bottom"
              titleStyle={{ color: "black" }}
              onPress={scrollToBottom}
            />
          ) : (
            <View style={{ backgroundColor: "black", height: 40 }} />
          )}
          <View>
            {/* Let's try using only FlatList with no ScrollView...seems to work so far? */}
            {/* <ScrollView> */}
            <FlatList
              style={{ backgroundColor: "#0af", height: 450 }}
              ref={scrollViewRef}
              // onContentSizeChange={handleAutoScroll}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              overScrollMode="auto"
              data={state}
              keyExtractor={keyExtractor}
              renderItem={({ item, index }) => renderItemOutside(item, index)}
              getItemLayout={(data, index) => ({
                length: 50,
                offset: 50 * index,
                index
              })}
              removeClippedSubviews={true}
            />
            {/* </ScrollView> */}
          </View>
          <Input
            value={content}
            onChangeText={setContent}
            placeholder="Type Your message here"
            inputStyle={{ color: "#fff" }}
            placeholderTextColor="#fff"
          />
          <Button title="Send Message" onPress={sendNewMessage} />
        </View>
      </KeyboardShift>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000"
  }
});

export default memo(withNavigationFocus(RoomScreen));
