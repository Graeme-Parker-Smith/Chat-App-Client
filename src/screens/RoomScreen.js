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
  Keyboard,
  Platform,
  Dimensions
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
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { MaterialIcons } from "@expo/vector-icons";

// let _layoutsMap = [];
let itemHeights = [];

const RoomScreen = ({ navigation, isFocused }) => {
  const scrollViewRef = useRef();
  const didMountRef = useRef(false);
  const socket = useContext(SocketContext);
  const roomName = navigation.getParam("roomName");
  const username = navigation.getParam("username");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [endScrollPosition, setEndScrollPosition] = useState(0);
  const [scrollValues, setScrollValues] = useState({
    layoutHeight: 0,
    offsetY: 0,
    contentHeight: 0
  });
  const [users, setUsers] = useState([]);
  const {
    state,
    fetchMessages,
    addMessage,
    addQuickMessage,
    fetchEarlierMessages,
    clearMessages
  } = useContext(MessageContext);

  // ============================================================
  //                HANDLE COMPONENT DID MOUNT AND UNMOUNT
  // ============================================================

  useEffect(() => {
    socket.emit("join", { name: username, room: roomName }, error => {
      if (error) {
        if (error === "Username is taken") {
          navigation.replace("Account");
          alert("Error: Username is Taken.");
        }
      }
    });

    return () => {
      console.log("component unmounting");
      socket.emit("leave", { room: roomName, name: username });
    };
  }, []);

  // ============================================================
  //              HANDLE COMPONENT RECEIVE DATA FROM SERVER
  // ============================================================

  useEffect(() => {
    socket.on("message", ({ user, avatar, text, isImage, isVideo }) => {
      const newMessage = {
        creator: user,
        avatar,
        content: text,
        isImage,
        isVideo,
        roomName
      };
      addQuickMessage(newMessage);
      if (user === username) addMessage(newMessage, state);
      handleAutoScroll();
    });

    socket.on("roomData", ({ users }) => {
      const userNames = users.map(u => u.name);
      setUsers(userNames);
    });
    return () => {
      socket.emit("disconnect");
      socket.off();

      // clearMessages();
    };
  }, [state, users]);

  // ============================================================
  //   HANDLE COMPONENT LOSE FOCUS/NAVIGATE AWAY FROM SCREEN
  // ============================================================

  useEffect(() => {
    if (didMountRef.current) {
      if (!isFocused) {
        socket.emit("leave", { room: roomName, name: username });
      }
    } else {
      didMountRef.current = true;
    }
  }, [isFocused]);

  // ============================================================
  //                SEND TEXT MESSAGE FUNCTION
  // ============================================================

  const sendNewMessage = () => {
    const messageToSend = {
      creator: username,
      content,
      roomName,
      isImage: false,
      isVideo: false
    };
    socket.emit("sendMessage", messageToSend);
    setContent("");
  };

  // ============================================================
  //                IMAGE AND VIDEO FUNCTIONS
  // ============================================================
  const getPermissionAsync = async () => {
    if (Platform.OS === "ios") {
      console.log("starting async permissions");
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    }
  };

  const _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: undefined
    });

    console.log(result);

    if (!result.cancelled) {
      let imageToSend;
      if (result.type === "video") {
        imageToSend = {
          creator: username,
          content: result.uri,
          roomName,
          isImage: false,
          isVideo: true
        };
      } else {
        imageToSend = {
          creator: username,
          content: result.uri,
          roomName,
          isImage: true,
          isVideo: false
        };
      }
      socket.emit("sendMessage", imageToSend);
    }
  };
  const launchCamera = async () => {
    await Permissions.askAsync(Permissions.CAMERA_ROLL);
    await Permissions.askAsync(Permissions.CAMERA);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: undefined
    });

    console.log(result);

    if (!result.cancelled) {
      let imageToSend;
      if (result.type === "video") {
        imageToSend = {
          creator: username,
          content: result.uri,
          roomName,
          isImage: false,
          isVideo: true
        };
      } else {
        imageToSend = {
          creator: username,
          content: result.uri,
          roomName,
          isImage: true,
          isVideo: false
        };
      }
      socket.emit("sendMessage", imageToSend);
    }
  };

  // ============================================================
  //                SCROLL FUNCTIONS
  // ============================================================
  const scrollToBottom = () => {
    if (scrollViewRef.current.scrollToEnd && state.length > 10) {
      try {
        // const offset = getOffsetByIndex(state.length - 1);
        const offset = itemHeights.reduce((a, b) => a + b, 0);
        scrollViewRef.current.scrollToOffset({ offset, animated: false });
      } catch {
        console.log("scroll bs");
      }
    } else {
      console.log("scrollToBottom failed.");
    }
  };
  const handleScroll = async e => {
    setScrollValues({
      layoutHeight: e.nativeEvent.layoutMeasurement.height,
      offsetY: e.nativeEvent.contentOffset.y,
      contentHeight: e.nativeEvent.contentSize.height
    });
    setScrollPosition(e.nativeEvent.contentOffset.y);
    // console.log("scroll event CONTENT OFFSET.y: ", e.nativeEvent);

    // e.nativeEvent.contentOffset.y < 1 tells us if user has scrolled to top
    if (e.nativeEvent.contentOffset.y < 1 && loading === false) {
      setLoading(true);
      await fetchEarlierMessages(state, roomName);
      // May need to change this to scrollToOffset
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
    if (isCloseToBottom(scrollValues) && state.length > 10) {
      try {
        const offset = itemHeights.reduce((a, b) => a + b, 0);
        scrollViewRef.current.scrollToOffset({ offset, animated: false });
      } catch {
        console.log("scroll bs");
      }

      setEndScrollPosition(scrollPosition);
    }
  };

  const isCloseToBottom = ({ layoutHeight, offsetY, contentHeight }) => {
    const paddingToBottom = 20;
    return layoutHeight + offsetY >= contentHeight - paddingToBottom;
  };

  // ============================================================
  //                PREPARE FLATLIST PROPS
  // ============================================================

  const renderItemOutside = (item, index) => {
    return (
      <MessageItem
        content={item.content}
        username={item.creator}
        time={item.time}
        avatar={item.avatar}
        isImage={item.isImage ? true : false}
        isVideo={item.isVideo ? true : false}
        index={index}
      />
    );
  };

  const keyExtractor = item => (item._id ? item._id : uuid());

  // ============================================================
  //                CREATE LIST OF USERS IN ROOM
  // ============================================================
  let userList = users.reduce((total, value, idx) => {
    if (idx === 0) return total + value;
    return total + ", " + value;
  }, []);

  // ============================================================
  //                DO THIS ON SCREEN FOCUS
  // ============================================================
  const handleOnFocus = async () => {
    await clearMessages();
    // console.log("FETCHING MESSAGES!!!!!!!!!");
    await fetchMessages(roomName);
    scrollToBottom();
  };

  return (
    <SafeAreaView style={styles.body}>
      <NavigationEvents onWillFocus={handleOnFocus} />
      <KeyboardShift messages={state}>
        <View
          style={{ marginTop: 10, backgroundColor: "#000" }}
        >
          <Text style={{ marginLeft: 20, fontSize: 40, color: "#fff" }}>
            User: {username}
          </Text>
          <Text style={{ marginLeft: 20, fontSize: 20, color: "#fff" }}>
            @{roomName} ({users.length} users online): {userList}
          </Text>
          {!isCloseToBottom(scrollValues) ? (
            <Button
              buttonStyle={{ height: 40, backgroundColor: "#0af" }}
              title="Jump to Bottom"
              titleStyle={{ color: "black" }}
              onPress={scrollToBottom}
            />
          ) : (
            <View style={{ backgroundColor: "black", height: 40 }} />
          )}
          <View>
            <FlatList
              style={{
                backgroundColor: "black",
                height: Platform.OS === "ios" ? 470 : 447,
                flexGrow: 0
              }}
              bounces={false}
              indicatorStyle="white"
              ref={scrollViewRef}
              onContentSizeChange={handleAutoScroll}
              onScroll={handleScroll}
              scrollEventThrottle={16}
              overScrollMode="auto"
              data={state}
              keyExtractor={keyExtractor}
              renderItem={({ item, index }) => renderItemOutside(item, index)}
              getItemLayout={(data, index) => {
                let height = 46;
                if (data[index].isImage || data[index].isVideo) {
                  height = 224.33325;
                } else if (data[index].content.length > 32) {
                  height = 67.33337;
                }
                itemHeights[index] = height;
                return {
                  length: height,
                  offset: height * index,
                  index
                };
              }}
              removeClippedSubviews={true}
            />
          </View>
          <Input
            value={content}
            onChangeText={setContent}
            placeholder="Type Your message here"
            inputStyle={{ color: "#fff" }}
            placeholderTextColor="#fff"
            leftIcon={
              <View
                style={{
                  width: 75,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  marginLeft: 0
                }}
              >
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color="#0af"
                  onPress={launchCamera}
                />
                <MaterialIcons
                  name="photo-library"
                  size={32}
                  color="#0af"
                  onPress={_pickImage}
                />
              </View>
            }
          />
          <Button title="Send Message" onPress={sendNewMessage} />
        </View>
      </KeyboardShift>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#000",
    height: Dimensions.get("window").height
  }
});

export default memo(withNavigationFocus(RoomScreen));
