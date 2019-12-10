import React, { useContext, useState } from "react";
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
import { Context as ChannelContext } from "../context/ChannelContext";
import { FontAwesome } from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const [newChannelName, setNewChannelName] = useState("");
  const { signout } = useContext(AuthContext);
  const { state, fetchChannels, createChannel } = useContext(ChannelContext);
  console.log(state);

  return (
    <>
      <NavigationEvents onWillFocus={fetchChannels} />
      <SafeAreaView forceInset={{ top: "always" }}>
        <Text style={{ fontSize: 48, textAlign: "center" }}>
          Account Screen. Yay! You made it! Your username is {state.currentUser}
        </Text>
        <Input
          value={newChannelName}
          onChangeText={setNewChannelName}
          placeholder="Name your new channel"
        />
        <Button
          title="Create New Channel"
          onPress={() => createChannel({ name: newChannelName, creator: state.currentUser })}
        />
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
                    username: state.currentUser
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
  }
});

export default AccountScreen;
