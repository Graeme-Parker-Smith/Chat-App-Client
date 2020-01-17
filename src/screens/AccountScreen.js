import React, { useContext, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { Button, Input } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { NavigationEvents } from "react-navigation";
import Spacer from "../components/Spacer";
import { ListItem } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ChannelContext } from "../context/ChannelContext";
import { FontAwesome } from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const [newChannelName, setNewChannelName] = useState("");
  const { signout } = useContext(AuthContext);
  // const { avatar } = useContext(AuthContext).state;
  const { state, fetchChannels, createChannel } = useContext(ChannelContext);

  if (!state.currentUser) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "black",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <NavigationEvents onWillFocus={fetchChannels} />
        <ActivityIndicator size="large" color="#0af" />
      </View>
    );
  }

  console.log("currentUser", state.currentUser);
  return (
    <>
      <SafeAreaView
        forceInset={{ top: "always" }}
        style={{
          backgroundColor: "#000",
          height: Dimensions.get("window").height
        }}
      >
        <Text
          style={{
            fontSize: 24,
            textAlign: "center",
            borderBottomWidth: 1,
            borderBottomColor: "#d3d3d3",
            marginBottom: 3,
            color: "white"
          }}
        >
          User: {state.currentUser.username}
        </Text>
        <View>
          {state.currentUser ? (
            <Image
              source={{ uri: state.currentUser.avatar }}
              style={styles.avatarStyle}
            />
          ) : null}
        </View>
        <Button
          title="Edit User"
          onPress={() => console.log("open editUserForm")}
        />
        <Input
          value={newChannelName}
          onChangeText={setNewChannelName}
          placeholder="Name your new channel"
          inputStyle={{ color: "#fff" }}
          placeholderTextColor="#fff"
        />
        <Button
          title="Create New Channel"
          onPress={() => {
            createChannel({ name: newChannelName, creator: state.currentUser });
            setNewChannelName("");
          }}
        />
        {/* <View>
          <Image
            source={{
              uri: `file:///var/mobile/Containers/Data/Application/14E88F17-8860-46F6-BB0B-892C349136E9/Library/Caches/ExponentExperienceData/%2540anonymous%252Fgraeme-chat-app-9aad46b5-69ea-42a1-925c-9f5b2d70d3a8/ImagePicker/1F6EEADC-08C5-469D-8091-AAD54703B9BF.gif`
            }}
            style={{ height: 200, width: 200 }}
          />
        </View> */}
        <View>
          <ScrollView style={{ height: 450 }}>
            <FlatList
              style={{ marginTop: 20 }}
              data={state.channels}
              keyExtractor={item => item.name}
              renderItem={({ item }) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("Room", {
                        roomName: item.name,
                        username: state.currentUser.username
                      })
                    }
                  >
                    <ListItem
                      containerStyle={styles.channel}
                      chevron
                      title={item.name}
                      titleStyle={styles.title}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </ScrollView>
        </View>
        <Spacer>
          <Button title="Sign Out" onPress={signout} />
        </Spacer>
      </SafeAreaView>
    </>
  );

  return <></>;
};

AccountScreen.navigationOptions = {
  tabBarIcon: <FontAwesome name="gear" size={20} />
};

const styles = StyleSheet.create({
  channel: {
    backgroundColor: "rgba(228,60,63,1.0)",
    margin: 5,
    borderRadius: 10
  },
  title: {
    color: "white"
  },
  avatarStyle: {
    height: 100,
    width: 100,
    borderRadius: 50
  }
});

export default AccountScreen;
