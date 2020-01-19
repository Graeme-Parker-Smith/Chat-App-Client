import React, { useContext, useState, useEffect } from "react";
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
import EditUserForm from "../components/EditUserForm";
import { ListItem } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ChannelContext } from "../context/ChannelContext";
import { FontAwesome } from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const [newChannelName, setNewChannelName] = useState("");
  const { signout } = useContext(AuthContext);
  // const { avatar } = useContext(AuthContext).state;
  const { state, fetchChannels, createChannel } = useContext(ChannelContext);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!state.currentUser || isLoading) {
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

  return (
    <>
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
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
        <Button title="Edit User" onPress={() => setShowEditUserForm(true)} />
        <EditUserForm
          shouldShow={showEditUserForm}
          setShowEditUserForm={setShowEditUserForm}
          setIsLoading={setIsLoading}
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
        <View>
          {/* <ScrollView style={{ height: 450 }}> */}
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
          {/* </ScrollView> */}
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
    height: 50,
    width: 50,
    borderRadius: 50
  },
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#000"
  }
});

export default AccountScreen;
