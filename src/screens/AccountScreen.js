import React, { useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import { SafeAreaView } from "react-navigation";
import { NavigationEvents } from "react-navigation";
import Spacer from "../components/Spacer";
import { ListItem } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ChannelContext } from "../context/ChannelContext";
import { FontAwesome } from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  const { state, fetchChannels } = useContext(ChannelContext);
  console.log(state);

  return (
    <>
      <NavigationEvents onWillFocus={fetchChannels} />
      <SafeAreaView forceInset={{ top: "always" }}>
        <Text style={{ fontSize: 48, textAlign: "center" }}>
          Account Screen. Yay! You made it! Your username is {state.currentUser}
        </Text>
        <Spacer>
          <Button title="Sign Out" onPress={signout} />
        </Spacer>
        <FlatList
          style={{ marginTop: 20 }}
          data={state.channels}
          keyExtractor={item => item._id}
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
