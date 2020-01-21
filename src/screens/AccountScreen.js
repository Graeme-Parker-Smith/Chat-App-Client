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
import LoadingIndicator from "../components/LoadingIndicator";
import CreateChannelForm from "../components/CreateChannelForm";
import EditUserForm from "../components/EditUserForm";
import { ListItem } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { Context as ChannelContext } from "../context/ChannelContext";
import { FontAwesome, Entypo } from "@expo/vector-icons";

const AccountScreen = ({ navigation }) => {
  const { signout } = useContext(AuthContext);
  const { state, fetchChannels } = useContext(ChannelContext);
  const [showEditUserForm, setShowEditUserForm] = useState(false);
  const [showCreateChannelForm, setShowCreateChannelForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditUserClick = () => {
    setShowEditUserForm(true);
    setShowCreateChannelForm(false);
  };
  const handleCreateChannelClick = () => {
    setShowCreateChannelForm(true);
    setShowEditUserForm(false);
  };

  if (!state.currentUser || isLoading) {
    return (
      <View>
        <NavigationEvents onWillFocus={fetchChannels} />
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <>
      <SafeAreaView forceInset={{ top: "always" }} style={styles.container}>
        <View style={styles.userDisplay}>
          <View>
            {state.currentUser ? (
              <Image
                source={{ uri: state.currentUser.avatar }}
                style={styles.avatarStyle}
              />
            ) : null}
          </View>
          <Text style={styles.userTitle}>{state.currentUser.username}</Text>
          <Entypo
            name="edit"
            color="#0af"
            size={32}
            onPress={handleEditUserClick}
            style={{ alignSelf: "center", marginLeft: 10 }}
          />
          <FontAwesome
            name="plus-circle"
            color="#0af"
            size={32}
            style={{ alignSelf: "center", marginLeft: 10 }}
            onPress={handleCreateChannelClick}
          />
        </View>
        <View>
          {showEditUserForm ? (
            <EditUserForm
              showForm={setShowEditUserForm}
              setIsLoading={setIsLoading}
            />
          ) : null}
          {showCreateChannelForm ? (
            <CreateChannelForm showForm={setShowCreateChannelForm} />
          ) : null}
        </View>
        <View>
          <FlatList
            style={{ marginTop: 20, height: 350 }}
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
                  {item.avatar ? (
                    <Image
                      source={{ uri: item.avatar }}
                      style={styles.avatarStyle}
                    />
                  ) : null}
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
        </View>
        <Spacer>
          <Button title="Sign Out" onPress={signout} />
        </Spacer>
      </SafeAreaView>
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
  },
  avatarStyle: {
    height: 50,
    width: 50,
    borderRadius: 50
  },
  container: {
    height: Dimensions.get("window").height,
    backgroundColor: "#000"
  },
  userDisplay: {
    flexDirection: "row",
    justifyContent: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    paddingBottom: 10
  },
  userTitle: {
    fontSize: 32,
    textAlign: "center",
    marginLeft: 10,
    marginBottom: 3,
    alignSelf: "center",
    color: "white"
  }
});

export default AccountScreen;
