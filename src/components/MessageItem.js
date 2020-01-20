import React, { memo } from "react";
import { StyleSheet, Image, View, Dimensions } from "react-native";
import { ListItem } from "react-native-elements";
import Spacer from "./Spacer";
import timeConverter from "../helpers/timeConverter";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import { Video } from "expo-av";
import VideoPlayer from "expo-video-player";

const DefaultAvatar = () => <Entypo name="user" size={20} color="#0af" />;

const MessageItem = ({
  content,
  username,
  time,
  avatar,
  isImage,
  isVideo,
  setVideoState
}) => {
  // calculate how long ago msg was sent and create title content for msg
  let howLongAgo;
  if (time) {
    const now = new Date();
    howLongAgo = timeConverter(time, now);
  }
  const deets = howLongAgo
    ? "from: " + username + "  -  " + howLongAgo
    : "from: " + username;

  // If user avatar, display that in left icon, else use default avatar
  let avatarImage;
  if (avatar) {
    avatarImage = (
      <View>
        <Image source={{ uri: avatar }} style={styles.avatarStyle} />
      </View>
    );
  } else {
    avatarImage = DefaultAvatar;
  }

  // check whether subtitle prop should render content as Text, Image, or Video
  let renderedContent;
  if (isVideo) {
    renderedContent = (
      <View style={{ height: 200, width: 200 }}>
        <FontAwesome
          name="play-circle"
          size={30}
          color="#0af"
          iconStyle={{
            height: 200,
            width: 200,
            position: "absolute",
            top: 100,
            right: 100,
            opacity: 0.5
          }}
          onPress={() =>
            setVideoState({ videoIsPlaying: true, videoUri: content })
          }
        >
          {/* <Video
            source={{ uri: content }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            // shouldPlay
            // isLooping
            natural
          /> */}
        </FontAwesome>
      </View>
      // <VideoPlayer
      //   videoProps={{
      //     shouldPlay: true,
      //     resizeMode: Video.RESIZE_MODE_CONTAIN,
      //     source: { uri: content },
      //     fullscreen
      //   }}
      //   inFullscreen={true}
      // />
    );
  } else if (isImage) {
    renderedContent = (
      <View>
        <Image source={{ uri: content }} style={{ height: 200, width: 200 }} />
      </View>
    );
  } else {
    renderedContent = content;
  }

  return (
    <ListItem
      containerStyle={
        username === "Admin"
          ? { ...styles.messageBody, backgroundColor: "green" }
          : styles.messageBody(isImage)
      }
      title={deets}
      titleStyle={styles.title}
      subtitle={renderedContent}
      subtitleStyle={styles.subtitle}
      leftAvatar={avatarImage}
      // onLayout={event => {
      //   const layout = event.nativeEvent.layout;
      //   addToLayoutsMap(layout, index);
      // }}
    ></ListItem>
  );
};

const styles = StyleSheet.create({
  messageBody: () => ({
    backgroundColor: "black",
    padding: 5,
    width: Dimensions.get("window").width
  }),
  title: {
    color: "#0af",
    fontSize: 12
  },
  subtitle: {
    color: "white",
    fontSize: 18
  },
  avatarStyle: {
    height: 45,
    width: 45,
    borderRadius: 20
  }
});

export default memo(MessageItem);
